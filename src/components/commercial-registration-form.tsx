"use client";

import { FormEvent, useState } from "react";

type FormState = {
  company: string;
  cnpj: string;
  contactName: string;
  phone: string;
  email: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  company: "",
  cnpj: "",
  contactName: "",
  phone: "",
  email: "",
  message: "",
};

export function CommercialRegistrationForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/commercial-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Nao foi possivel enviar o cadastro agora.");
      }

      setStatus("success");
      setFeedback("Cadastro enviado com sucesso. Nossa equipe financeira entrara em contato.");
      setFormData(INITIAL_STATE);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Erro ao enviar cadastro.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-1">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#d7e9ff]">Empresa</span>
        <input
          required
          value={formData.company}
          onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
          className="w-full rounded-md border border-[#7fb0ea] bg-white/95 px-3 py-2 text-sm text-[#0f2e53] outline-none focus:border-[#1b8bff]"
        />
      </label>

      <label className="sm:col-span-1">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#d7e9ff]">CNPJ</span>
        <input
          required
          value={formData.cnpj}
          onChange={(event) => setFormData((prev) => ({ ...prev, cnpj: event.target.value }))}
          className="w-full rounded-md border border-[#7fb0ea] bg-white/95 px-3 py-2 text-sm text-[#0f2e53] outline-none focus:border-[#1b8bff]"
        />
      </label>

      <label className="sm:col-span-1">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#d7e9ff]">Responsavel</span>
        <input
          required
          value={formData.contactName}
          onChange={(event) => setFormData((prev) => ({ ...prev, contactName: event.target.value }))}
          className="w-full rounded-md border border-[#7fb0ea] bg-white/95 px-3 py-2 text-sm text-[#0f2e53] outline-none focus:border-[#1b8bff]"
        />
      </label>

      <label className="sm:col-span-1">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#d7e9ff]">Telefone</span>
        <input
          required
          value={formData.phone}
          onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
          className="w-full rounded-md border border-[#7fb0ea] bg-white/95 px-3 py-2 text-sm text-[#0f2e53] outline-none focus:border-[#1b8bff]"
        />
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#d7e9ff]">E-mail comercial</span>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-md border border-[#7fb0ea] bg-white/95 px-3 py-2 text-sm text-[#0f2e53] outline-none focus:border-[#1b8bff]"
        />
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#d7e9ff]">Observacoes (opcional)</span>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-md border border-[#7fb0ea] bg-white/95 px-3 py-2 text-sm text-[#0f2e53] outline-none focus:border-[#1b8bff]"
        />
      </label>

      <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-md bg-[#1b8bff] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(12,81,165,0.45)] transition hover:bg-[#0f6ed7] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Enviando cadastro..." : "Enviar cadastro comercial"}
        </button>

        {feedback ? (
          <p className={`text-sm ${status === "success" ? "text-[#cbf6d4]" : "text-[#ffd3d3]"}`}>{feedback}</p>
        ) : null}
      </div>
    </form>
  );
}
