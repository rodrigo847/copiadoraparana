"use client";

import { useState, type FormEvent } from "react";

type ExtractedData = {
  texto_completo: string;
  data?: string;
  hora?: string;
  latitude?: string;
  longitude?: string;
  placa?: string;
};

const examples = [
  {
    label: "Cupom ou recibo",
    text: `Registro de Entrada
Data: 17/10/2026 Hora: 14:30
Local: Av. Sete de Setembro, Curitiba
GPS: -25.428470, -49.273460
Placa: ABC-1234`,
  },
  {
    label: "Latitude e longitude",
    text: `Entrada Veículo
17-10-2026 09:15
Latitude: -25.430120 Longitude: -49.280500
Placa: XYZ9W87`,
  },
  {
    label: "Texto simples",
    text: `17/10/2026 16:45
-25.419876 / -49.265432
Placa: MNO-5678`,
  },
];

function isValidDate(day: number, month: number, year: number) {
  if (month < 1 || month > 12 || day < 1 || year < 1) return false;

  const daysInMonth = [
    31,
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day <= daysInMonth[month - 1];
}

function isValidCoordinatePair(latitude: string, longitude: string) {
  const lat = Number(latitude);
  const long = Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(long) &&
    lat >= -90 &&
    lat <= 90 &&
    long >= -180 &&
    long <= 180
  );
}

function extractData(text: string): ExtractedData {
  const data: ExtractedData = { texto_completo: text };
  const dateTimeMatch = text.match(
    /\b(\d{2})[/-](\d{2})[/-](\d{4})\D+(\d{1,2}):(\d{2})\b/,
  );

  if (dateTimeMatch) {
    const [, day, month, year, hour, minute] = dateTimeMatch;
    if (
      isValidDate(Number(day), Number(month), Number(year)) &&
      Number(hour) < 24 &&
      Number(minute) < 60
    ) {
      data.data = `${day}${dateTimeMatch[0].includes("-") ? "-" : "/"}${month}${dateTimeMatch[0].includes("-") ? "-" : "/"}${year}`;
      data.hora = `${hour}:${minute}`;
    }
  }

  const latitudeMatch = text.match(
    /\b(?:lat(?:itude)?)\s*[:=]?\s*([+-]?\d+(?:\.\d+)?)/i,
  );
  const longitudeMatch = text.match(
    /\b(?:lon(?:gitude)?)\s*[:=]?\s*([+-]?\d+(?:\.\d+)?)/i,
  );

  if (
    latitudeMatch &&
    longitudeMatch &&
    isValidCoordinatePair(latitudeMatch[1], longitudeMatch[1])
  ) {
    data.latitude = latitudeMatch[1];
    data.longitude = longitudeMatch[1];
  } else {
    const gpsMatch = text.match(
      /([+-]?\d+\.\d+)\s*[,/; ]+\s*([+-]?\d+\.\d+)/,
    );

    if (
      gpsMatch &&
      isValidCoordinatePair(gpsMatch[1], gpsMatch[2])
    ) {
      data.latitude = gpsMatch[1];
      data.longitude = gpsMatch[2];
    }
  }

  const plateMatch = text.match(/\b([A-Z]{3}-?\d[A-Z0-9]\d{2})\b/i);
  if (plateMatch) data.placa = plateMatch[1].toUpperCase();

  return data;
}

const resultFields = [
  { key: "data", label: "Data" },
  { key: "hora", label: "Hora" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "placa", label: "Placa" },
] as const;

export function DataExtractor() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ExtractedData | null>(null);
  const [notice, setNotice] = useState("");

  const analyze = (value: string) => {
    setText(value);
    setResult(value.trim() ? extractData(value) : null);
    setNotice("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    analyze(text);
  };

  const copyText = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(successMessage);
    } catch {
      setNotice("Não foi possível copiar. Verifique a permissão do navegador.");
    }
  };

  const foundFields = result
    ? resultFields.filter(({ key }) => result[key])
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-[#d5e2f0] bg-white p-5 shadow-[0_18px_50px_rgba(15,45,80,0.12)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3973b9]">
                Entrada
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-[#0f1f39]">
                Cole seu texto
              </h2>
            </div>
            <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#38699f]">
              Processamento local
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-[#5f7390]">
            Os dados são analisados neste navegador e não são enviados para um
            servidor.
          </p>

          <form className="mt-5" onSubmit={handleSubmit}>
            <label
              htmlFor="extractor-text"
              className="mb-2 block text-sm font-semibold text-[#193a62]"
            >
              Texto para analisar
            </label>
            <textarea
              id="extractor-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setResult(null);
                setNotice("");
              }}
              placeholder={"Ex.: Data: 17/10/2026 Hora: 14:30\nGPS: -25.428470, -49.273460\nPlaca: ABC-1234"}
              rows={10}
              className="w-full resize-y rounded-2xl border border-[#cbd9e9] bg-[#fbfdff] px-4 py-3 text-sm leading-6 text-[#193a62] outline-none transition placeholder:text-[#91a2b8] focus:border-[#4389dc] focus:ring-4 focus:ring-[#4389dc]/15"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!text.trim()}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1681ff] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d69d7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Extrair informações
              </button>
              <button
                type="button"
                onClick={() => analyze("")}
                disabled={!text && !result}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#cbd9e9] px-5 py-2.5 text-sm font-semibold text-[#385979] transition hover:bg-[#f2f7fd] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpar
              </button>
            </div>
          </form>

          <div className="mt-7 border-t border-[#e3ebf4] pt-5">
            <p className="text-sm font-semibold text-[#193a62]">
              Ou carregue um exemplo:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => analyze(example.text)}
                  className="rounded-full border border-[#d5e2f0] bg-[#f7faff] px-3.5 py-2 text-xs font-semibold text-[#38699f] transition hover:border-[#8ab5e8] hover:bg-[#eef5ff]"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-live="polite"
          className="rounded-3xl border border-[#d5e2f0] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] p-5 shadow-[0_18px_50px_rgba(15,45,80,0.12)] sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3973b9]">
                Resultado
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-[#0f1f39]">
                Dados encontrados
              </h2>
            </div>
            {result && foundFields.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  void copyText(
                    JSON.stringify(result, null, 2),
                    "JSON copiado para a área de transferência.",
                  )
                }
                className="rounded-full border border-[#b9d1ec] bg-white px-4 py-2 text-xs font-bold text-[#2865a8] transition hover:bg-[#eef5ff]"
              >
                Copiar JSON
              </button>
            )}
          </div>

          {!result ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#cbd9e9] bg-white/70 px-4 py-8 text-center">
              <p className="font-semibold text-[#385979]">
                Seu resultado aparecerá aqui.
              </p>
              <p className="mt-2 text-sm leading-6 text-[#71849d]">
                Cole um texto e selecione “Extrair informações” ou carregue um
                dos exemplos.
              </p>
            </div>
          ) : foundFields.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#f0d8a3] bg-[#fffaf0] px-4 py-5">
              <p className="font-semibold text-[#795922]">
                Nenhum dado conhecido foi encontrado.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#8a7043]">
                Confira se o texto contém data e hora, coordenadas decimais ou
                placa no padrão brasileiro.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-[#5f7390]">
                Encontramos {foundFields.length}{" "}
                {foundFields.length === 1 ? "campo" : "campos"} no texto.
              </p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultFields.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-[#e1eaf4] bg-white px-4 py-3"
                  >
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#71849d]">
                      {label}
                    </dt>
                    <dd className="mt-1 break-all font-heading text-lg font-semibold text-[#193a62]">
                      {result[key] ?? "Não encontrado"}
                    </dd>
                  </div>
                ))}
              </dl>
              <details className="mt-5 rounded-2xl border border-[#e1eaf4] bg-white">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#38699f]">
                  Ver resultado completo (JSON)
                </summary>
                <pre className="overflow-x-auto border-t border-[#e1eaf4] px-4 py-3 text-xs leading-5 text-[#385979]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </>
          )}

          <p className="mt-5 min-h-5 text-sm font-medium text-[#2865a8]" role="status">
            {notice}
          </p>
        </section>
      </div>

      <p className="mt-5 text-center text-xs leading-5 text-[#8fa1b7]">
        Protótipo: os resultados dependem dos padrões identificados e devem ser
        conferidos antes do uso.
      </p>
    </div>
  );
}
