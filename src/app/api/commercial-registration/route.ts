import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { site } from "@/lib/site";

type RegistrationPayload = {
  company: string;
  cnpj: string;
  contactName: string;
  phone: string;
  email: string;
  message?: string;
};

const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

function getMissingEnvVars(): string[] {
  return requiredEnvVars.filter((name) => !process.env[name]);
}

export async function POST(request: Request) {
  const missing = getMissingEnvVars();
  if (missing.length > 0) {
    return NextResponse.json(
      {
        message: "Servico de envio indisponivel no momento. Contate nosso WhatsApp para cadastro.",
      },
      { status: 500 },
    );
  }

  let payload: RegistrationPayload;
  try {
    payload = (await request.json()) as RegistrationPayload;
  } catch {
    return NextResponse.json({ message: "Dados invalidos no envio." }, { status: 400 });
  }

  const { company, cnpj, contactName, phone, email, message } = payload;
  if (!company || !cnpj || !contactName || !phone || !email) {
    return NextResponse.json({ message: "Preencha todos os campos obrigatorios." }, { status: 400 });
  }

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: site.financialEmail,
      replyTo: email,
      subject: `Solicitacao de cadastro comercial - ${company}`,
      text: [
        "Nova solicitacao de cadastro comercial.",
        "",
        `Empresa: ${company}`,
        `CNPJ: ${cnpj}`,
        `Responsavel: ${contactName}`,
        `Telefone: ${phone}`,
        `Email: ${email}`,
        `Observacoes: ${message || "Nao informado"}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Nao foi possivel enviar agora. Tente novamente em alguns instantes." },
      { status: 500 },
    );
  }
}
