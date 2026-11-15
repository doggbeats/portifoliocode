"use client";

import {
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { useContactIntent } from "@/components/contact-intent-provider";
import { solutionOptions } from "@/lib/content";
import { getWhatsAppUrl } from "@/lib/site";
import {
  buildContactMessage,
  validateContact,
  type ContactData,
  type ContactErrors,
} from "@/lib/validation";

type FormValues = ContactData & {
  companyWebsite: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

type Feedback = {
  title: string;
  message: string;
  code?: string;
};

const emptyValues: FormValues = {
  name: "",
  company: "",
  whatsapp: "",
  solution: "",
  message: "",
  companyWebsite: "",
};

const fieldIds: Record<keyof ContactData, string> = {
  name: "contato-name",
  company: "contato-company",
  whatsapp: "contato-whatsapp",
  solution: "contato-solution",
  message: "contato-message",
};

export function ContactForm({
  initialSolution = "",
}: {
  initialSolution?: string;
}) {
  const [values, setValues] = useState<FormValues>(() => ({
    ...emptyValues,
    solution: initialSolution,
  }));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sentOnce, setSentOnce] = useState(false);

  const updateField = (field: keyof ContactData, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const focusFirstError = (fieldErrors: ContactErrors) => {
    const firstField = Object.keys(fieldErrors).find(
      (key): key is keyof ContactData => key in fieldIds,
    );

    if (firstField) {
      document.getElementById(fieldIds[firstField])?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    const validation = validateContact(values);

    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("error");
      setFeedback({
        title: "Revise o formulário",
        message: validation.message,
      });
      focusFirstError(validation.errors);
      return;
    }

    setErrors({});
    setFeedback(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            code?: string;
            errors?: ContactErrors;
          }
        | null;

      if (!response.ok || !result?.ok) {
        setErrors(result?.errors || {});
        setStatus("error");
        setFeedback({
          title: "Não foi possível enviar",
          message:
            result?.message ||
            "O envio não foi concluído. Nenhuma mensagem foi enviada.",
          code: result?.code,
        });
        return;
      }

      setStatus("success");
      setSentOnce(true);
      setFeedback({
        title: "Solicitação enviada",
        message:
          "O briefing chegou ao servidor da CODE_PH. A análise será feita a partir das informações enviadas.",
      });
      setValues(emptyValues);
    } catch {
      setStatus("error");
      setFeedback({
        title: "Falha de conexão",
        message:
          "Não foi possível conectar ao servidor. Nenhuma mensagem foi enviada. Tente novamente ou use o WhatsApp.",
      });
    }
  };

  const whatsappFallback = getWhatsAppUrl(buildContactMessage(values));
  const describedBy = (field: keyof ContactData) =>
    errors[field] ? `${fieldIds[field]}-error` : undefined;

  return (
    <form
      id="briefing"
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={status === "submitting"}
      data-contact-form
    >
      <div className="contact-form__head">
        <div>
          <p className="section-label">Briefing rápido</p>
          <h3>Conte o que precisa funcionar melhor.</h3>
        </div>
        <span className="contact-form__required">* obrigatório</span>
      </div>

      {feedback ? (
        <div
          className={`form-status form-status--${status}`}
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {status === "success" ? (
            <CircleCheck aria-hidden="true" />
          ) : (
            <CircleAlert aria-hidden="true" />
          )}
          <div>
            <strong>{feedback.title}</strong>
            <p>{feedback.message}</p>
            {status === "error" &&
            feedback.code === "NOT_CONFIGURED" &&
            whatsappFallback ? (
              <a
                href={whatsappFallback}
                className="form-status__link"
                target="_blank"
                rel="noreferrer"
              >
                Continuar no WhatsApp
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <fieldset disabled={status === "submitting"}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="contato-name">Nome *</label>
            <input
              id="contato-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy("name")}
              maxLength={80}
            />
            {errors.name ? (
              <p className="field__error" id="contato-name-error">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="contato-company">Empresa</label>
            <input
              id="contato-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Nome da empresa"
              value={values.company}
              onChange={(event) => updateField("company", event.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={describedBy("company")}
              maxLength={120}
            />
            {errors.company ? (
              <p className="field__error" id="contato-company-error">
                {errors.company}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="contato-whatsapp">WhatsApp *</label>
            <input
              id="contato-whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              value={values.whatsapp}
              onChange={(event) => updateField("whatsapp", event.target.value)}
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby={describedBy("whatsapp")}
              maxLength={24}
            />
            {errors.whatsapp ? (
              <p className="field__error" id="contato-whatsapp-error">
                {errors.whatsapp}
              </p>
            ) : null}
          </div>

          <div className="field field--select">
            <label htmlFor="contato-solution">Tipo de solução *</label>
            <select
              id="contato-solution"
              name="solution"
              value={values.solution}
              onChange={(event) => updateField("solution", event.target.value)}
              aria-invalid={Boolean(errors.solution)}
              aria-describedby={describedBy("solution")}
            >
              <option value="" disabled>
                Selecione uma solução
              </option>
              {solutionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpRight
              className="field__select-icon"
              aria-hidden="true"
            />
            {errors.solution ? (
              <p className="field__error" id="contato-solution-error">
                {errors.solution}
              </p>
            ) : null}
          </div>
        </div>

        <div className="field field--message">
          <div className="field__label-row">
            <label htmlFor="contato-message">Descrição do projeto *</label>
            <span className="field__counter">
              {values.message.length}/2000
            </span>
          </div>
          <textarea
            id="contato-message"
            name="message"
            rows={5}
            placeholder="Conte brevemente o contexto, o problema e o que você gostaria de resolver."
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            maxLength={2000}
          />
          {errors.message ? (
            <p className="field__error" id="contato-message-error">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="hp-field" aria-hidden="true">
          <label htmlFor="contato-website">Não preencha este campo</label>
          <input
            id="contato-website"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.companyWebsite}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                companyWebsite: event.target.value,
              }))
            }
          />
        </div>

        <div className="contact-form__actions">
          <button
            type="submit"
            className="btn btn--primary contact-form__submit"
          >
            <span>
              {status === "submitting" ? "Enviando..." : "Solicitar orçamento"}
            </span>
            {status === "submitting" ? (
              <Loader2
                className="icon-arrow motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ArrowUpRight className="icon-arrow" aria-hidden="true" />
            )}
          </button>

          <p className="contact-form__privacy">
            <ShieldCheck aria-hidden="true" />
            Seus dados serão usados apenas para responder a esta solicitação.
          </p>
        </div>
      </fieldset>

      {whatsappFallback ? (
        <a
          href={whatsappFallback}
          className="contact-form__whatsapp"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle aria-hidden="true" />
          <span>
            {sentOnce
              ? "Enviar outra mensagem pelo WhatsApp"
              : "Prefere conversar pelo WhatsApp?"}
          </span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      ) : null}
    </form>
  );
}

export function ContactFormSlot() {
  const { intent } = useContactIntent();

  return (
    <ContactForm
      key={intent?.stamp ?? 0}
      initialSolution={intent?.solution ?? ""}
    />
  );
}
