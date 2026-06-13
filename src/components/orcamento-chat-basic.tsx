"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FINISHING_TYPES,
  MATERIALS,
  MAX_QUANTITY,
  MIN_UNIT_PRICE_SMALL_PIECE,
  PRINTING_TYPES,
  RIGID_MATERIALS,
  UV_SMALL_PIECE_LABOR_SURCHARGE,
  VERSO_TYPES,
  getMinimumPurchaseForItem,
  isBannerMaterial,
  isUvSmallPiece,
  isValidBannerSize,
  type Unit,
} from "@/lib/orcamento-pricing";

type ParsedRequest = {
  quantity: number | null;
  height: number | null;
  width: number | null;
  unit: Unit;
  material: string | null;
  printingType: string | null;
  rigidMaterial: string | null;
  finishing: string | null;
  verso: string | null;
};

type QuoteResult = {
  ok: boolean;
  error?: string;
  missing?: string[];
  summary?: string;
};

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function toAreaM2(height: number, width: number, unit: Unit): number {
  if (unit === "m2") return height * width;
  const multiplier = unit === "mm" ? 0.001 : 0.01;
  return height * multiplier * (width * multiplier);
}

function toCm(value: number, unit: Unit): number {
  if (unit === "mm") return value / 10;
  if (unit === "cm") return value;
  return Math.sqrt(value) * 100;
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value: string): number {
  return Number.parseFloat(value.replace(",", "."));
}

function toCmFromLength(value: number, unit: "mm" | "cm" | "m"): number {
  if (unit === "mm") return value / 10;
  if (unit === "m") return value * 100;
  return value;
}

function detectMaterial(text: string): string | null {
  if (/\bban+n?er(?:es)?\b/.test(text)) return "banner_brilho";
  if (text.includes("vinil transparente")) return "vinil_transparente_brilho";
  if (text.includes("vinil fosco")) return "vinil_branco_fosco";
  if (text.includes("vinil brilho")) return "vinil_branco_brilho";
  if (text.includes("couche") || text.includes("offset 150")) return "papel_couche_fosco_150g";
  if (text.includes("banner fosco")) return "banner_fosco";
  if (text.includes("banner brilho")) return "banner_brilho";
  if (text.includes("adesivo")) return "vinil_branco_brilho";
  if (text.includes("banner")) return "banner_brilho";
  return null;
}

function detectPrintingType(text: string, material: string | null): string | null {
  if (text.includes("imp uv") || text.includes("impressao uv") || text.includes(" uv ")) return "uv";
  if (text.includes("eco") || text.includes("solvente")) return "eco_solvente";

  if (material && material !== "sem_material") {
    return "eco_solvente";
  }

  return null;
}

function detectRigidMaterial(text: string): string | null {
  if (/\bps\s*1\b/.test(text)) return "ps_1mm";
  if (/\bps\s*2\b/.test(text)) return "ps_2mm";
  if (/\bps\s*3\b/.test(text)) return "ps_3mm";
  if (/\bacrilico\s*2\b/.test(text)) return "acrilico_2mm";
  if (/\bacrilico\s*3\b/.test(text)) return "acrilico_3mm";

  // Mensagens de WhatsApp costumam vir apenas com "acrilico" sem espessura.
  // Para nao bloquear o fluxo, assume 2mm como padrao inicial de estimativa.
  if (text.includes("acrilico")) return "acrilico_2mm";

  if (text.includes("triplex")) return "c2s_triplex";
  if (text.includes("material cliente")) return "forn_cliente";
  return null;
}

function detectFinishing(text: string): string | null {
  if (text.includes("meio corte")) return "meio_corte";
  if (text.includes("corte total")) return "corte_total";
  if (text.includes("corte laser")) return "corte_laser";
  if (text.includes("corte dobra") || text.includes("corte e dobra")) return "corte_dobra";
  if (text.includes("ilhos")) return "com_ilhos";
  if (text.includes("madeira")) return "com_madeira";
  if (text.includes("cavalete")) return "aplicacao_cavalete";
  return "sem_acabamento";
}

function detectVerso(text: string): string | null {
  if (text.includes("com verso") || text.includes("frente e verso")) return "com_verso";
  return "sem_verso";
}

function isPriceInquiry(text: string): boolean {
  return /(quanto|valor|preco|custa|sai)/.test(text) && /(metro|m2|m²)/.test(text);
}

function buildBasePriceSummary(
  material: string,
  rigidMaterial: string,
  printingType: string,
  finishing: string,
): string | null {
  const lines: string[] = [];

  if (material !== "sem_material") {
    lines.push(
      `Material: ${MATERIALS[material]?.name || material} = ${formatCurrency(MATERIALS[material]?.pricePerM2 || 0)}/m2;`,
    );
  }

  if (rigidMaterial !== "sem_rigido") {
    lines.push(
      `Material rigido: ${RIGID_MATERIALS[rigidMaterial]?.name || rigidMaterial} = ${formatCurrency(RIGID_MATERIALS[rigidMaterial]?.pricePerM2 || 0)}/m2;`,
    );
  }

  if (printingType !== "sem_impressao") {
    lines.push(
      `Impressao: ${PRINTING_TYPES[printingType]?.name || printingType} = ${formatCurrency(PRINTING_TYPES[printingType]?.pricePerM2 || 0)}/m2;`,
    );
  }

  if (finishing !== "sem_acabamento") {
    lines.push(
      `Acabamento: ${FINISHING_TYPES[finishing]?.name || finishing} = ${formatCurrency(FINISHING_TYPES[finishing]?.pricePerM2 || 0)}/m2;`,
    );
  }

  if (lines.length === 0) return null;

  const basePerM2 =
    (MATERIALS[material]?.pricePerM2 || 0) +
    (RIGID_MATERIALS[rigidMaterial]?.pricePerM2 || 0) +
    (PRINTING_TYPES[printingType]?.pricePerM2 || 0) +
    (FINISHING_TYPES[finishing]?.pricePerM2 || 0);

  lines.push(`Valor base combinado: ${formatCurrency(basePerM2)}/m2;`);
  lines.push("Obs: valor final depende de tamanho, quantidade e regras de minimo.");

  return lines.join("\n");
}

function parseRequest(raw: string): ParsedRequest {
  const text = ` ${normalizeText(raw)} `;
  const material = detectMaterial(text);

  const dimensionMatch = text.match(
    /(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\s*(?:x|por|\*)\s*(\d+(?:[.,]\d+)?)\s*(mm|cm|m|m2)?/,
  );
  let height: number | null = null;
  let width: number | null = null;
  let unit: Unit = "cm";

  if (dimensionMatch) {
    const rawHeight = parseNumber(dimensionMatch[1]);
    const rawHeightUnit = dimensionMatch[2] as "mm" | "cm" | "m" | undefined;
    const rawWidth = parseNumber(dimensionMatch[3]);
    const rawWidthUnit = dimensionMatch[4] as "mm" | "cm" | "m" | "m2" | undefined;
    const hasDecimalDimension = /[.,]\d+/.test(dimensionMatch[1]) || /[.,]\d+/.test(dimensionMatch[3]);
    const bothUnitsMissing = !rawHeightUnit && !rawWidthUnit;
    const shouldInferMetersForBanner =
      bothUnitsMissing &&
      material !== null &&
      isBannerMaterial(material) &&
      (hasDecimalDimension || (rawHeight <= 10 && rawWidth <= 10));

    // Mantem suporte de area m2 quando informada no final (ex.: 2x3m2).
    if (!rawHeightUnit && rawWidthUnit === "m2") {
      unit = "m2";
      height = rawHeight;
      width = rawWidth;
    } else if (shouldInferMetersForBanner) {
      unit = "cm";
      height = rawHeight * 100;
      width = rawWidth * 100;
    } else {
      const defaultLengthUnit = rawHeightUnit ?? (rawWidthUnit && rawWidthUnit !== "m2" ? rawWidthUnit : "cm");
      const safeHeightUnit = rawHeightUnit ?? defaultLengthUnit;
      const safeWidthUnit = rawWidthUnit && rawWidthUnit !== "m2" ? rawWidthUnit : defaultLengthUnit;

      unit = "cm";
      height = toCmFromLength(rawHeight, safeHeightUnit);
      width = toCmFromLength(rawWidth, safeWidthUnit);
    }
  }

  const quantityMatch = text.match(/(\d{1,6})\s*(?:un|unds|unidades|pecas|adesivos|banners|placas)?\b/);
  let quantity: number | null = null;

  if (quantityMatch) {
    const parsedQty = Number.parseInt(quantityMatch[1], 10);
    if (Number.isFinite(parsedQty) && parsedQty > 0) {
      quantity = Math.min(parsedQty, MAX_QUANTITY);
    }
  }

  if (!quantity && /\b(um|uma)\b/.test(text)) {
    quantity = 1;
  }

  const rigidMaterial = detectRigidMaterial(text);
  const printingType = detectPrintingType(text, material);
  const finishing = detectFinishing(text);
  const verso = detectVerso(text);

  return {
    quantity,
    height,
    width,
    unit,
    material,
    printingType,
    rigidMaterial,
    finishing,
    verso,
  };
}

function buildQuote(raw: string): QuoteResult {
  const normalizedRaw = normalizeText(raw);
  const isMeterPriceQuestion = isPriceInquiry(normalizedRaw);
  const isAvailabilityQuestion = /(fazem|faz|conseguem|trabalham com|tem opcao|voces fazem)/.test(
    normalizedRaw,
  );
  const parsed = parseRequest(raw);

  const quantity = parsed.quantity;
  const height = parsed.height;
  const width = parsed.width;
  const unit = parsed.unit;
  const material = parsed.material ?? "sem_material";
  const rigidMaterial = parsed.rigidMaterial ?? "sem_rigido";
  const printingType = parsed.printingType ?? "sem_impressao";
  const finishing = parsed.finishing ?? "sem_acabamento";
  const verso = parsed.verso ?? "sem_verso";

  if (isMeterPriceQuestion) {
    const priceSummary = buildBasePriceSummary(material, rigidMaterial, printingType, finishing);
    if (priceSummary) {
      return { ok: true, summary: priceSummary };
    }
  }

  const missing: string[] = [];
  if (!quantity) missing.push("quantidade");
  if (!height || !width) missing.push("tamanho (ex: 3x3cm)");
  if (material === "sem_material" && rigidMaterial === "sem_rigido") missing.push("material");

  if (missing.length > 0) {
    if (isAvailabilityQuestion && (material !== "sem_material" || rigidMaterial !== "sem_rigido")) {
      const serviceLabel =
        material !== "sem_material"
          ? MATERIALS[material]?.name
          : RIGID_MATERIALS[rigidMaterial]?.name;

      const missingHint = missing.join(", ");

      return {
        ok: false,
        missing,
        error: `Sim, fazemos ${serviceLabel?.toLowerCase() || "esse material"}! Para calcular certinho, preciso de: ${missingHint}.`,
      };
    }

    return {
      ok: false,
      missing,
      error: `Preciso de mais dados para calcular: ${missing.join(", ")}.`,
    };
  }

  if (quantity === null || height === null || width === null) {
    return {
      ok: false,
      error: "Nao foi possivel interpretar os dados do pedido.",
    };
  }

  const safeQuantity: number = quantity;
  const safeHeight: number = height;
  const safeWidth: number = width;

  const hCm = toCm(safeHeight, unit);
  const wCm = toCm(safeWidth, unit);

  if (printingType === "uv" && (hCm > 60 || wCm > 90)) {
    return { ok: false, error: "Impressao UV permite no maximo 60cm x 90cm." };
  }

  if (printingType === "eco_solvente" && (hCm > 180 || wCm > 5000)) {
    return { ok: false, error: "Eco-solvente permite no maximo 1,80m x 50m." };
  }

  if (printingType === "eco_solvente" && rigidMaterial !== "sem_rigido") {
    return { ok: false, error: "Eco-solvente so permite adesivo/banner (sem material rigido)." };
  }

  if (printingType === "uv" && material !== "sem_material") {
    return { ok: false, error: "Impressao UV so permite material rigido (sem adesivo/banner)." };
  }

  if (verso === "com_verso" && printingType === "sem_impressao") {
    return { ok: false, error: "Para incluir verso, informe um tipo de impressao." };
  }

  if (isBannerMaterial(material) && !isValidBannerSize(hCm, wCm)) {
    return {
      ok: false,
      error:
        "Para banner, o tamanho minimo e 60x80cm. Se estiver informando em metros, use por exemplo 1x1.80m.",
    };
  }

  const areaM2 = toAreaM2(safeHeight, safeWidth, unit);
  const materialPrice = MATERIALS[material]?.pricePerM2 ?? 0;
  const printingPrice = PRINTING_TYPES[printingType]?.pricePerM2 || 0;
  const rigidPrice = RIGID_MATERIALS[rigidMaterial]?.pricePerM2 || 0;
  const finishingPrice = FINISHING_TYPES[finishing]?.pricePerM2 || 0;
  const smallPieceMultiplier = areaM2 < 0.0009 ? 1.4 : 1;
  const versoPrice = (VERSO_TYPES[verso]?.pricePerM2 || 0) * areaM2;

  const calculatedUnitPrice =
    areaM2 * (materialPrice + printingPrice + rigidPrice + finishingPrice) * smallPieceMultiplier +
    versoPrice;

  const isSmallerThanTwoByTwoCm = hCm < 2 && wCm < 2;
  let unitPrice = isSmallerThanTwoByTwoCm
    ? Math.max(calculatedUnitPrice, MIN_UNIT_PRICE_SMALL_PIECE)
    : calculatedUnitPrice;

  if (isUvSmallPiece(printingType, hCm, wCm)) {
    unitPrice += UV_SMALL_PIECE_LABOR_SURCHARGE;
  }

  const itemMinimumPurchase = getMinimumPurchaseForItem(printingType, hCm, wCm);
  const rawTotalPrice = unitPrice * safeQuantity;
  const totalPrice = Math.max(rawTotalPrice, itemMinimumPurchase);
  const finalUnitPrice = totalPrice / safeQuantity;
  const minimumWasApplied = rawTotalPrice < itemMinimumPurchase;
  const finishingLabel = FINISHING_TYPES[finishing]?.name || finishing;
  const printingLabel = PRINTING_TYPES[printingType]?.name || printingType;
  const materialLabel = MATERIALS[material]?.name || material;
  const rigidLabel = RIGID_MATERIALS[rigidMaterial]?.name || rigidMaterial;
  const versoLabel = VERSO_TYPES[verso]?.name || verso;
  const substrateLabel = material !== "sem_material" ? materialLabel : rigidLabel;
  const descricao = `${safeHeight}x${safeWidth}${unit}, ${substrateLabel}, ${printingLabel}, ${versoLabel}`;

  const summaryLines = [
    `Descricao: ${descricao};`,
    `Quantidade: ${safeQuantity}un;`,
    `Acabamento: ${finishingLabel};`,
    `Valor Unit: ${formatCurrency(finalUnitPrice)};`,
    `Valor total: ${formatCurrency(totalPrice)};`,
  ];

  if (minimumWasApplied) {
    summaryLines.push(
      `Obs: valor minimo deste servico e ${formatCurrency(itemMinimumPurchase)}.`,
    );
  }

  const summary = summaryLines.join("\n");

  return { ok: true, summary };
}

export function OrcamentoChatBasic() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Escreva seu pedido em linguagem natural para receber uma estimativa rapida. Exemplo: 'Quero 150 adesivos 3x3cm em vinil brilho'.",
    },
  ]);

  const placeholder = useMemo(
    () => "Ex: quero 150 adesivos 3x3cm em vinil brilho",
    []
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const clean = prompt.trim();
    if (!clean) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: clean,
    };

    const quote = buildQuote(clean);
    const assistantText = quote.ok
      ? `${quote.summary}`
      : `${quote.error}\n\nTente algo como: 150 adesivos 3x3cm em vinil brilho.`;

    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: assistantText,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setPrompt("");

    // Salva a interação no Firestore para aprendizado futuro
    addDoc(collection(db, "chat_logs"), {
      pergunta: clean,
      resposta: assistantText,
      resolvido: quote.ok,
      campos_faltando: quote.missing ?? [],
      timestamp: serverTimestamp(),
    }).catch(() => {
      // falha silenciosa — não impacta o usuário
    });
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-[1.2rem] border border-[#c7d4e6] bg-[#f7f9fc] px-5 py-7 shadow-[0_12px_28px_rgba(19,38,68,0.08)] sm:px-7 sm:py-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9e9ff] text-[#165bb8]">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        </span>
        <div>
          <h2 className="font-heading text-2xl tracking-tight text-[#0f1f39]">Chat de Orcamento (MVP)</h2>
          <p className="text-sm text-[#4a6486]">Pagina de testes sem impacto na calculadora oficial.</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#d3e1f3] bg-white p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "assistant"
                ? "bg-[#eef5ff] text-[#193a62]"
                : "ml-auto bg-[#1b63c4] text-white"
            }`}
          >
            <p className="whitespace-pre-line">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="h-12 w-full rounded-2xl border border-[#c8d2df] bg-white px-4 text-[1rem] text-[#203653] outline-none transition focus:border-[#77a6e7]"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#79a2e3] px-6 text-[1rem] font-semibold text-white transition hover:bg-[#668fd3]"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
