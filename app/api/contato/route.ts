import { NextResponse } from "next/server";

import { solutionOptions } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { validateContact, type ContactData } from "@/lib/validation";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 6;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();

  for (const [storedIp, attempt] of attempts) {
    if (now > attempt.resetAt) {
      attempts.delete(storedIp);
    }
  }

  const current = attempts.get(ip);

  if (!current) {
    if (attempts.size > 1000) {
      attempts.clear();
    }

    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_MAX_ATTEMPTS;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSolutionLabel(solution: string) {
  return (
    solutionOptions.find((option) => option.value === solution)?.label ||
    solution
  );
}

function buildEmail(data: ContactData) {
  const solution = getSolutionLabel(data.solution);
  const rows = [
    ["Nome", data.name],
    ["Empresa", data.company || "Não informada"],
    ["WhatsApp", data.whatsapp],
    ["Solução", solution],
  ];

  const text = [
    "Nova solicitação de orçamento — CODE_PH",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Descrição do projeto:",
    data.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:640px">
      <h1 style="font-size:20px;margin:0 0 24px">Nova solicitação de orçamento</h1>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e5e5;font-weight:bold;vertical-align:top">${escapeHtml(label)}</td>
                <td style="padding:8px 0;border-bottom:1px solid #e5e5e5">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px">Descrição do projeto</h2>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
    </div>
  `;

  return { text, html, solution };
}

async function sendWithResend(data: ContactData) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return null;
  }

  const content = buildEmail(data);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nova solicitação — ${data.name.replace(/[\r\n]+/g, " ")}`,
      text: content.text,
      html: content.html,
    }),
    signal: AbortSignal.timeout(10000),
  });

  return response.ok;
}

async function sendWithWebhook(data: ContactData) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    return null;
  }

  const secret = process.env.CONTACT_WEBHOOK_SECRET;
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({
      source: "code-ph-site",
      submittedAt: new Date().toISOString(),
      site: siteConfig.url,
      data: {
        ...data,
        solutionLabel: getSolutionLabel(data.solution),
      },
    }),
    signal: AbortSignal.timeout(10000),
  });

  return response.ok;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
      },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível ler os dados enviados.",
      },
      { status: 400 },
    );
  }

  const validation = validateContact(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: validation.message,
        errors: validation.errors,
      },
      { status: 422 },
    );
  }

  try {
    const resendResult = await sendWithResend(validation.data);

    if (resendResult === true) {
      return NextResponse.json({ ok: true });
    }

    if (resendResult === false) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "O canal de e-mail não aceitou o envio. Nenhuma mensagem foi entregue. Tente novamente ou use o WhatsApp.",
        },
        { status: 502 },
      );
    }

    const webhookResult = await sendWithWebhook(validation.data);

    if (webhookResult === true) {
      return NextResponse.json({ ok: true });
    }

    if (webhookResult === false) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "O canal de envio não aceitou a solicitação. Nenhuma mensagem foi entregue. Tente novamente ou use o WhatsApp.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: "NOT_CONFIGURED",
        message:
          "O envio pelo formulário ainda não está configurado neste ambiente. Nenhuma mensagem foi enviada. Configure um canal no servidor ou use o WhatsApp.",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("[contato] Falha ao encaminhar a solicitação.", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "O envio não foi concluído. Nenhuma mensagem foi enviada. Tente novamente em instantes ou use o WhatsApp.",
      },
      { status: 502 },
    );
  }
}
