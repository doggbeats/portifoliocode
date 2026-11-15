import { solutionOptions } from "@/lib/content";

export type ContactField =
  | "name"
  | "company"
  | "whatsapp"
  | "solution"
  | "message";

export type ContactData = Record<ContactField, string>;

export type ContactErrors = Partial<Record<ContactField | "form", string>>;

type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; errors: ContactErrors; message: string };

const allowedSolutions = new Set(solutionOptions.map((option) => option.value));

function readField(input: Record<string, unknown>, key: string) {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      ok: false,
      errors: { form: "Não foi possível ler os dados enviados." },
      message: "Revise os dados e tente novamente.",
    };
  }

  const source = input as Record<string, unknown>;

  if (readField(source, "companyWebsite")) {
    return {
      ok: false,
      errors: { form: "Não foi possível validar o envio." },
      message: "Revise os dados e tente novamente.",
    };
  }

  const data: ContactData = {
    name: readField(source, "name"),
    company: readField(source, "company"),
    whatsapp: readField(source, "whatsapp"),
    solution: readField(source, "solution"),
    message: readField(source, "message"),
  };

  const errors: ContactErrors = {};

  if (data.name.length < 2) {
    errors.name = "Informe seu nome.";
  } else if (data.name.length > 80) {
    errors.name = "Use no máximo 80 caracteres.";
  }

  if (data.company.length > 120) {
    errors.company = "Use no máximo 120 caracteres.";
  }

  const whatsappDigits = data.whatsapp.replace(/\D/g, "");

  if (!data.whatsapp) {
    errors.whatsapp = "Informe um número de WhatsApp.";
  } else if (!/^[\d\s()+.-]+$/.test(data.whatsapp)) {
    errors.whatsapp = "Use apenas números, espaços e os sinais + ( ) - .";
  } else if (whatsappDigits.length < 10 || whatsappDigits.length > 15) {
    errors.whatsapp = "Informe um número válido com DDD.";
  }

  if (!data.solution) {
    errors.solution = "Selecione o tipo de solução.";
  } else if (!allowedSolutions.has(data.solution)) {
    errors.solution = "Selecione uma opção válida.";
  }

  if (data.message.length < 20) {
    errors.message = "Descreva o projeto com pelo menos 20 caracteres.";
  } else if (data.message.length > 2000) {
    errors.message = "Use no máximo 2.000 caracteres.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      message: "Revise os campos destacados para continuar.",
    };
  }

  return { ok: true, data };
}

export function buildContactMessage(data: Partial<ContactData>) {
  const solution =
    solutionOptions.find((option) => option.value === data.solution)?.label ||
    "Ainda não definida";

  return [
    "Olá! Vim pelo site da CODE_PH.",
    "",
    `Nome: ${data.name || "não informado"}`,
    `Empresa: ${data.company || "não informada"}`,
    `WhatsApp: ${data.whatsapp || "não informado"}`,
    `Solução: ${solution}`,
    "",
    "Sobre o projeto:",
    data.message || "gostaria de conversar sobre uma necessidade digital.",
  ].join("\n");
}
