"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  BANNER_MIN_SIDE_LARGE_CM,
  BANNER_MIN_SIDE_SMALL_CM,
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
  productType: "chaveiro" | "placa_pix" | null;
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
  hint?: string;
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

function formatSizeCm(value: number): string {
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`.replace(".", ",");
}

function toCmFromLength(value: number, unit: "mm" | "cm" | "m"): number {
  if (unit === "mm") return value / 10;
  if (unit === "m") return value * 100;
  return value;
}

const QUANTITY_CONTEXT_PATTERN =
  "(?:un|unds|unidade(?:s)?|peca(?:s)?|adesivo(?:s)?|banner(?:es|s)?|placa(?:s)?|chaveiro(?:s)?|pix|folha(?:s)?|copia(?:s)?|exemplar(?:es)?)";

const NUMBER_WORD_VALUES: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  catorze: 14,
  quatorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100,
  cento: 100,
};

function parseWrittenQuantity(text: string): number | null {
  const baseWords = Object.keys(NUMBER_WORD_VALUES).join("|");
  const writtenPattern = new RegExp(
    `\\b(${baseWords})(?:\\s+e\\s+(${baseWords}))?\\s*(?:${QUANTITY_CONTEXT_PATTERN})?\\b`,
    "i",
  );

  const match = text.match(writtenPattern);
  if (!match) return null;

  const first = NUMBER_WORD_VALUES[match[1].toLowerCase()];
  const second = match[2] ? NUMBER_WORD_VALUES[match[2].toLowerCase()] : 0;

  if (!Number.isFinite(first)) return null;
  const total = first + second;
  return total > 0 ? Math.min(total, MAX_QUANTITY) : null;
}

function detectMaterial(text: string): string | null {
  // Banner must be checked before generic patterns
  if (/\bban+n?er(?:es|s)?\s+fosco\b/.test(text)) return "banner_fosco";
  if (/\bban+n?er(?:es|s)?\s+brilho\b/.test(text)) return "banner_brilho";
  if (/\bban+n?er(?:es|s)?\b/.test(text)) return "banner_brilho"; // default to shiny if not specified
  
  // Vinyl materials - order matters for specificity
  if (/\bvinil\s+transparente\b/.test(text)) return "vinil_transparente_brilho";
  if (/\bvinil\s+fosco\b/.test(text)) return "vinil_branco_fosco";
  if (/\bvinil\s+brilho\b/.test(text)) return "vinil_branco_brilho";
  if (/\badesivo\s+vinil\b/.test(text)) return "vinil_branco_brilho";
  if (/\bvinil\b/.test(text)) return "vinil_branco_brilho"; // default to shiny
  if (/\badesivo\b/.test(text)) return "vinil_branco_brilho";
  
  // Paper materials
  if (/\b(?:couche|offset)\s*150/.test(text)) return "papel_couche_fosco_150g";
  if (/\bcouche\b/.test(text)) return "papel_couche_fosco_150g";
  if (/\bpapel\b/.test(text)) return "papel_couche_fosco_150g";
  
  return null;
}

function detectPrintingType(text: string, material: string | null): string | null {
  // UV first - explicit detection
  if (/\b(?:imp\s+)?uv\b/.test(text) || /\bimpressao\s+uv\b/.test(text)) return "uv";
  
  // Eco-solvente - multiple patterns
  if (/\beco[\s-]?solvente\b/.test(text) || /\becosolv\b/.test(text)) return "eco_solvente";
  if (/\bsolvente\b/.test(text) && !text.includes("uv")) return "eco_solvente";
  if (text.includes("eco ") || text.includes("ecologico")) return "eco_solvente";
  
  // Banner and vinyl materials default to eco-solvente if they have printing
  if (material && material !== "sem_material" && material !== "papel_couche_fosco_150g") {
    return "eco_solvente";
  }

  return null;
}

function detectRigidMaterial(text: string): string | null {
  // Acrylic - check for explicit thickness first
  if (/\bacrilico\s*2(?:\s*mm)?\b/.test(text)) return "acrilico_2mm";
  if (/\bacrilico\s*3(?:\s*mm)?\b/.test(text)) return "acrilico_3mm";
  if (/\bacrilico\b/.test(text)) return "acrilico_2mm"; // Default to 2mm if no thickness specified
  
  // PS - polystyrene with thickness
  if (/\bps\s*1(?:\s*mm)?\b/.test(text)) return "ps_1mm";
  if (/\bps\s*2(?:\s*mm)?\b/.test(text)) return "ps_2mm";
  if (/\bps\s*3(?:\s*mm)?\b/.test(text)) return "ps_3mm";
  
  // Other rigid materials
  if (/\b(?:c2s\s+)?triplex\b/.test(text)) return "c2s_triplex";
  if (/\bmaterial\s+cliente|cliente\s+fornece\b/.test(text)) return "forn_cliente";
  
  return null;
}

function detectFinishing(text: string): string | null {
  // Check specific patterns first
  if (/\b(?:corte\s+)?laser\b/.test(text)) return "corte_laser";
  if (/\b(?:corte\s+)?dobra\b/.test(text) || /\bdobragem\b/.test(text)) return "corte_dobra";
  if (/\bcorte\s+total\b/.test(text) || /\bcorte\s+tudo\b/.test(text)) return "corte_total";
  if (/\bmeio\s+corte\b/.test(text)) return "meio_corte";
  if (/\b(?:com\s+)?ilhos?\b/.test(text) || /\bollhos\b/.test(text)) return "com_ilhos";
  if (/\bmadeira\b/.test(text)) return "com_madeira";
  if (/\bcavalete\b/.test(text)) return "aplicacao_cavalete";
  
  return "sem_acabamento";
}

function detectVerso(text: string): string | null {
  if (/\bcom\s+verso\b/.test(text) || /\bfrente\s+e\s+verso\b/.test(text) || /\bfrente.verso\b/.test(text)) return "com_verso";
  if (/\bfrente\b/.test(text) && /\bverso\b/.test(text)) return "com_verso";
  return "sem_verso";
}

function detectProductType(text: string): "chaveiro" | "placa_pix" | null {
  if (/\bchaveiro(?:s)?\b/.test(text)) return "chaveiro";
  if (/\bplaca\s+(?:de\s+)?pix\b/.test(text)) return "placa_pix";
  return null;
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
  const productType = detectProductType(text);

  // Enhanced regex to capture dimensions with optional units
  // Supports: 3x3cm, 3x3, 100x180cm, 1x1.80m, 2x3m, 0.5x1.5m, etc.
  const dimensionMatch = text.match(
    /(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\s*(?:x|por|×|\*|a)\s*(\d+(?:[.,]\d+)?)\s*(mm|cm|m|m2)?/i,
  );
  
  let height: number | null = null;
  let width: number | null = null;
  let unit: Unit = "cm";

  if (dimensionMatch) {
    const rawHeight = parseNumber(dimensionMatch[1]);
    const rawHeightUnit = (dimensionMatch[2]?.toLowerCase() ?? "") as "mm" | "cm" | "m" | "";
    const rawWidth = parseNumber(dimensionMatch[3]);
    const rawWidthUnit = (dimensionMatch[4]?.toLowerCase() ?? "") as "mm" | "cm" | "m" | "m2" | "";
    
    const hasDecimalDimension = /[.,]\d+/.test(dimensionMatch[1]) || /[.,]\d+/.test(dimensionMatch[3]);
    const bothUnitsMissing = !rawHeightUnit && !rawWidthUnit;
    const shouldInferMetersForBanner =
      bothUnitsMissing &&
      material !== null &&
      isBannerMaterial(material) &&
      (hasDecimalDimension || (rawHeight <= 10 && rawWidth <= 10));

    // Handle m2 area format (ex.: 2x3m2)
    if (!rawHeightUnit && rawWidthUnit === "m2") {
      unit = "m2";
      height = rawHeight;
      width = rawWidth;
    } else if (shouldInferMetersForBanner) {
      // For banners without explicit units and small numbers, infer meters
      unit = "cm";
      height = rawHeight * 100;
      width = rawWidth * 100;
    } else {
      // Use provided units or default to cm
      const defaultUnit = rawHeightUnit || rawWidthUnit || "cm";
      const safeHeightUnit = rawHeightUnit || defaultUnit;
      const safeWidthUnit = (rawWidthUnit && rawWidthUnit !== "m2") ? rawWidthUnit : defaultUnit;

      unit = "cm";
      height = toCmFromLength(rawHeight, safeHeightUnit as "mm" | "cm" | "m");
      width = toCmFromLength(rawWidth, safeWidthUnit as "mm" | "cm" | "m");
    }
  }

  let quantity: number | null = null;

  // Remove dimensoes para nao confundir tamanho com quantidade (ex.: 100x100).
  const textWithoutDimensions = dimensionMatch ? text.replace(dimensionMatch[0], " ") : text;

  const quantityMatch = textWithoutDimensions.match(
    new RegExp(`\\b(\\d{1,6})\\s*${QUANTITY_CONTEXT_PATTERN}\\b`, "i"),
  );

  if (quantityMatch) {
    const parsedQty = Number.parseInt(quantityMatch[1], 10);
    if (Number.isFinite(parsedQty) && parsedQty > 0) {
      quantity = Math.min(parsedQty, MAX_QUANTITY);
    }
  }

  if (!quantity) {
    const writtenQty = parseWrittenQuantity(textWithoutDimensions);
    if (writtenQty) {
      quantity = writtenQty;
    }
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
    productType,
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

  let quantity = parsed.quantity;
  const height = parsed.height;
  const width = parsed.width;
  const unit = parsed.unit;
  const productType = parsed.productType;
  const material = parsed.material ?? "sem_material";
  let rigidMaterial = parsed.rigidMaterial ?? "sem_rigido";
  const printingType = parsed.printingType ?? "sem_impressao";
  let finishing = parsed.finishing ?? "sem_acabamento";
  const verso = parsed.verso ?? "sem_verso";
  let appliedRecommendation = false;
  let assumedBannerQuantity = false;
  let bannerMinimumApplied = false;
  let bannerMinimumRequestedLabel: string | null = null;
  let bannerMinimumChargedLabel: string | null = null;

  if (!quantity && material !== "sem_material" && isBannerMaterial(material)) {
    quantity = 1;
    assumedBannerQuantity = true;
  }

  if (productType === "chaveiro") {
    if (rigidMaterial === "sem_rigido") {
      rigidMaterial = "acrilico_2mm";
      appliedRecommendation = true;
    }

    if (finishing === "sem_acabamento") {
      finishing = "corte_laser";
      appliedRecommendation = true;
    }
  }

  if (productType === "placa_pix" && finishing === "sem_acabamento") {
    finishing = "corte_dobra";
    appliedRecommendation = true;
  }

  if (isMeterPriceQuestion) {
    const priceSummary = buildBasePriceSummary(material, rigidMaterial, printingType, finishing);
    if (priceSummary) {
      return { ok: true, summary: priceSummary };
    }
  }

  const missing: string[] = [];
  if (!quantity) missing.push("quantidade");
  if (!height || !width) missing.push("tamanho (ex: 3x3cm)");
  if (material === "sem_material" && rigidMaterial === "sem_rigido" && productType !== "placa_pix") {
    missing.push("material");
  }

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
        hint:
          productType === "chaveiro"
            ? "Exemplo recomendado: 50 chaveiros 5x7cm em acrilico 2mm com corte laser."
            : productType === "placa_pix"
              ? "Podemos cotar em duas opcoes: PS 2mm e Acrilico 2mm. O corte laser e indispensavel para montagem; a dobra e aplicada nas plaquinhas desses materiais. Exemplo: 10 placas de pix 20x30cm."
            : undefined,
      };
    }

    return {
      ok: false,
      missing,
      error: `Preciso de mais dados para calcular: ${missing.join(", ")}.`,
      hint:
        productType === "chaveiro"
          ? "Exemplo recomendado: 50 chaveiros 5x7cm em acrilico 2mm com corte laser."
          : productType === "placa_pix"
            ? "Podemos cotar em duas opcoes: PS 2mm e Acrilico 2mm. O corte laser e indispensavel para montagem; a dobra e aplicada nas plaquinhas desses materiais. Exemplo: 10 placas de pix 20x30cm."
          : undefined,
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

  let pricingHCm = hCm;
  let pricingWCm = wCm;

  if (isBannerMaterial(material) && !isValidBannerSize(hCm, wCm)) {
    const requestedSmall = Math.min(hCm, wCm);
    const requestedLarge = Math.max(hCm, wCm);
    const chargedSmall = Math.max(requestedSmall, BANNER_MIN_SIDE_SMALL_CM);
    const chargedLarge = Math.max(requestedLarge, BANNER_MIN_SIDE_LARGE_CM);

    bannerMinimumApplied = true;
    bannerMinimumRequestedLabel = `${formatSizeCm(requestedSmall)}x${formatSizeCm(requestedLarge)}cm`;
    bannerMinimumChargedLabel = `${formatSizeCm(chargedSmall)}x${formatSizeCm(chargedLarge)}cm`;

    if (hCm <= wCm) {
      pricingHCm = chargedSmall;
      pricingWCm = chargedLarge;
    } else {
      pricingHCm = chargedLarge;
      pricingWCm = chargedSmall;
    }
  }

  if (productType === "placa_pix" && rigidMaterial === "sem_rigido") {
    if (printingType === "eco_solvente") {
      return {
        ok: false,
        error: "Para placa de pix em material rigido, use UV ou sem impressao.",
      };
    }

    const areaM2ForOptions = toAreaM2(safeHeight, safeWidth, unit);
    const optionFinishing = finishing === "sem_acabamento" ? "corte_dobra" : finishing;

    const buildPlacaPixOption = (optionRigid: "ps_2mm" | "acrilico_2mm", title: string): string => {
      const materialPrice = MATERIALS[material]?.pricePerM2 ?? 0;
      const printingPrice = PRINTING_TYPES[printingType]?.pricePerM2 || 0;
      const rigidPrice = RIGID_MATERIALS[optionRigid]?.pricePerM2 || 0;
      const finishingPrice = FINISHING_TYPES[optionFinishing]?.pricePerM2 || 0;
      const smallPieceMultiplier = areaM2ForOptions < 0.0009 ? 1.4 : 1;
      const versoPrice = (VERSO_TYPES[verso]?.pricePerM2 || 0) * areaM2ForOptions;

      const calculatedUnitPrice =
        areaM2ForOptions * (materialPrice + printingPrice + rigidPrice + finishingPrice) * smallPieceMultiplier +
        versoPrice;

      const isSmallerThanTwoByTwoCm = hCm < 2 && wCm < 2;
      let optionUnitPrice = isSmallerThanTwoByTwoCm
        ? Math.max(calculatedUnitPrice, MIN_UNIT_PRICE_SMALL_PIECE)
        : calculatedUnitPrice;

      if (isUvSmallPiece(printingType, hCm, wCm)) {
        optionUnitPrice += UV_SMALL_PIECE_LABOR_SURCHARGE;
      }

      const itemMinimumPurchase = getMinimumPurchaseForItem(printingType, hCm, wCm);
      const rawTotalPrice = optionUnitPrice * safeQuantity;
      const totalPrice = Math.max(rawTotalPrice, itemMinimumPurchase);
      const finalUnitPrice = totalPrice / safeQuantity;
      const minimumWasApplied = rawTotalPrice < itemMinimumPurchase;
      const suggestedQuantityForMinimum =
        minimumWasApplied && optionUnitPrice > 0
          ? Math.ceil(itemMinimumPurchase / optionUnitPrice)
          : null;
      const finishingLabel = FINISHING_TYPES[optionFinishing]?.name || optionFinishing;
      const printingLabel = PRINTING_TYPES[printingType]?.name || printingType;
      const materialLabel = RIGID_MATERIALS[optionRigid]?.name || optionRigid;
      const sizeLabel = `${safeHeight}x${safeWidth}${unit}`;

      const lines = [
        `➡️ **${title}**`,
        `📦 Quantidade: ${safeQuantity} un.`,
        `📐 Tamanho: ${sizeLabel}`,
        `🧱 Material: ${materialLabel}`,
        printingLabel !== "Sem impressao" ? `🖨️ Impressao: ${printingLabel}` : null,
        `✂️ Acabamento: ${finishingLabel}`,
        `💵 Unitario: ${formatCurrency(finalUnitPrice)}`,
        `💰 Total: ${formatCurrency(totalPrice)}`,
      ].filter((line): line is string => Boolean(line));

      if (minimumWasApplied) {
        lines.push(`⚠️ Minimo aplicado: ${formatCurrency(itemMinimumPurchase)}.`);

        if (suggestedQuantityForMinimum && suggestedQuantityForMinimum > safeQuantity) {
          const suggestedTotalPrice = optionUnitPrice * suggestedQuantityForMinimum;
          const suggestedUnitPrice = suggestedTotalPrice / suggestedQuantityForMinimum;
          lines.push(
            `💡 Dica: com ${suggestedQuantityForMinimum} un., o unitario fica aprox. ${formatCurrency(suggestedUnitPrice)} (total aprox. ${formatCurrency(suggestedTotalPrice)}).`,
          );
        }
      }

      return lines.join("\n");
    };

    const summary = [
      "Para placa de pix, trabalhamos com duas opcoes recomendadas:",
      "",
      buildPlacaPixOption("ps_2mm", "Opcao Economica: PS 2mm"),
      "",
      buildPlacaPixOption("acrilico_2mm", "Opcao Premium: Acrilico 2mm"),
      "",
      "Obs: o corte laser e indispensavel para montagem; a dobra e aplicada nas plaquinhas de PS e Acrilico.",
    ].join("\n");

    return { ok: true, summary };
  }

  const areaM2 = bannerMinimumApplied
    ? (pricingHCm * pricingWCm) / 10000
    : toAreaM2(safeHeight, safeWidth, unit);
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
  const suggestedQuantityForMinimum =
    minimumWasApplied && unitPrice > 0
      ? Math.ceil(itemMinimumPurchase / unitPrice)
      : null;
  const finishingLabel = FINISHING_TYPES[finishing]?.name || finishing;
  const printingLabel = PRINTING_TYPES[printingType]?.name || printingType;
  const materialLabel = MATERIALS[material]?.name || material;
  const rigidLabel = RIGID_MATERIALS[rigidMaterial]?.name || rigidMaterial;
  const versoLabel = VERSO_TYPES[verso]?.name || verso;
  const substrateLabel = material !== "sem_material" ? materialLabel : rigidLabel;
  
  // More detailed description with all specifications
  const specs = [
    `${safeHeight}x${safeWidth}${unit}`,
    substrateLabel,
    printingLabel !== "Sem impressao" ? printingLabel : null,
    finishing !== "sem_acabamento" ? finishingLabel : null,
    verso !== "sem_verso" ? versoLabel : null,
  ].filter(Boolean).join(", ");

  const summaryLines = [
    `📋 **Especificação:** ${specs}`,
    `📦 **Quantidade:** ${safeQuantity} un.`,
    `💵 **Valor Unitário:** ${formatCurrency(finalUnitPrice)}`,
    `💰 **Valor Total:** ${formatCurrency(totalPrice)}`,
  ];

  if (productType === "chaveiro" && appliedRecommendation) {
    summaryLines.push(
      "💡 Recomendacao aplicada para chaveiro: Acrilico 2mm + Corte Laser.",
    );
  }

  if (assumedBannerQuantity) {
    summaryLines.push("ℹ️ Quantidade nao informada: considerei 1 unidade para o calculo.");
  }

  if (bannerMinimumApplied && bannerMinimumRequestedLabel && bannerMinimumChargedLabel) {
    summaryLines.push(
      `⚠️ Banner com tamanho minimo de ${BANNER_MIN_SIDE_SMALL_CM}x${BANNER_MIN_SIDE_LARGE_CM}cm. Pedido ${bannerMinimumRequestedLabel}; valor calculado em ${bannerMinimumChargedLabel}.`,
    );
  }

  if (minimumWasApplied) {
    summaryLines.push(
      `⚠️ Aplicado valor mínimo de serviço: ${formatCurrency(itemMinimumPurchase)}.`,
    );

    if (suggestedQuantityForMinimum && suggestedQuantityForMinimum > safeQuantity) {
      const suggestedTotalPrice = unitPrice * suggestedQuantityForMinimum;
      summaryLines.push(
        `💡 **Dica:** Para melhor aproveitamento, considere ${suggestedQuantityForMinimum} un. (total aprox. ${formatCurrency(suggestedTotalPrice)}).`,
      );
    }
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
      text: "Escreva seu orçamento e clique enviar",
    },
  ]);

  const placeholder = useMemo(
    () => "50 chaveiros 5x7cm",
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
      : `${quote.error}\n\n${quote.hint ?? "Tente algo como: 150 adesivos 3x3cm em vinil brilho."}`;

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
    <section className="mx-auto w-full max-w-none rounded-[1.2rem] border border-[#c7d4e6] bg-[#f7f9fc] px-5 py-7 shadow-[0_12px_28px_rgba(19,38,68,0.08)] sm:px-7 sm:py-8">
      <div className="space-y-5">
        <aside className="rounded-2xl border border-[#d3e1f3] bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d9e9ff] text-[#165bb8]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </span>
            <div>
              <h2 className="font-heading text-2xl tracking-tight text-[#0f1f39]">Chat de Orçamento!</h2>
              <p className="mt-1 text-sm text-[#4a6486]">Em treinamento para respostas automáticas.</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#dbe6f5] bg-[#f2f7ff] p-4">
            <p className="text-[1.04rem] leading-8 text-[#1f436b]">Descreva seu pedido com:</p>
            <ul className="mt-1 space-y-1 text-[1.02rem] leading-8 text-[#1f436b]">
              <li>Quantidade: 10 un.</li>
              <li>Tamanho: 20x30cm</li>
              <li>Material: PS 2mm ou acrilico 2mm</li>
            </ul>
            <p className="mt-2 text-[1rem] leading-7 text-[#3a5a82]">
              Exemplo rapido: &quot;10 placas de pix 20x30cm&quot;.
            </p>
          </div>
        </aside>

        <div className="rounded-2xl border border-[#d3e1f3] bg-white p-4 sm:p-5">
          <div className="space-y-3">
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
        </div>
      </div>
    </section>
  );
}
