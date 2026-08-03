"use client";

import { useMemo, useState } from "react";

type LaserQuoteItem = {
  id: number;
  material: string;
  quantity: number;
  mediaType: string;
  printingType: string;
  size: string;
  finishing: string;
  estimatedDeadline: string;
  paymentCondition: string;
  unitPrice: number;
  note: string;
};

type OrcamentoMateriaisLaserProps = {
  whatsappHref: string;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function parseCurrencyInput(value: string): number {
  return Number.parseFloat(value.replace(/\./g, "").replace(",", "."));
}

function normalizeQuantity(value: string): string {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly === "") return "";

  const parsed = Number.parseInt(digitsOnly, 10);
  if (!Number.isFinite(parsed)) return "1";

  return String(Math.max(1, Math.min(9999, parsed)));
}

const sizeOptions = [
  "A0 - 84,1 x 118,9 cm",
  "A1 - 59,4 x 84,1 cm",
  "A2 - 42,0 x 59,4 cm",
  "A3 - 29,7 x 42,0 cm",
  "A4 - 21,0 x 29,7 cm",
  "A5 - 14,8 x 21,0 cm",
  "A6 - 10,5 x 14,8 cm",
];
const finishingOptions = ["Sem acabamento", "Laminação fosca", "Laminação brilho", "Plastificação 07", "Dobra", "Grampo", "Encadernação", "Meio corte", "Corte Total"];
const printingTypeOptions = ["Laser Colorida", "Laser PB", "Jato de Tinta", "Offset", "Ecosolvente", "UV", "Plotagem"];
const mediaTypeOptionsByPrintingType: Record<string, string[]> = {
  Plotagem: ["Offset"],
  "Laser Colorida": ["Offset", "Couche", "Colacril", "Aspen"],
  "Laser PB": ["Offset"],
  "Jato de Tinta": ["Offset"],
  Offset: ["Offset", "Couche"],
  Ecosolvente: ["Banner", "Vinil Fosco", "Vinil Brilho", "Vinil Transparente", "Couche", "Offset"],
  UV: ["Rígido", "Material Cliente"],
};

const gramaturaOptionsByPrintingType: Record<string, string[]> = {
  Plotagem: ["75g", "150g"],
  "Laser Colorida": ["75g", "90g", "150g", "170g", "250g", "C2s 300g"],
  "Laser PB": ["75g", "90g"],
  "Jato de Tinta": ["75g", "90g", "120g", "Envelope XXX"],
  Offset: ["90g", "150g", "250g", "300g"],
  Ecosolvente: [],
  UV: [],
};

function getMediaTypeOptionsForPrintingType(value: string): string[] {
  return mediaTypeOptionsByPrintingType[value] ?? [];
}

function getGramaturaOptionsForPrintingType(value: string): string[] {
  return gramaturaOptionsByPrintingType[value] ?? [];
}

function getGramaturaOptions(printingTypeValue: string, mediaTypeValue: string): string[] {
  if (printingTypeValue === "Plotagem") {
    return ["75g", "150g"];
  }

  if (printingTypeValue.startsWith("Laser") && mediaTypeValue === "Colacril") {
    return ["170g Fosco", "170g Brilho"];
  }

  if (mediaTypeValue === "Aspen") {
    return ["240g Aspen Perolado", "240g Aspen Majorca"];
  }

  if (mediaTypeValue === "Offset") {
    return ["75g", "90g", "120g", "180g", "240g"];
  }

  const baseOptions = getGramaturaOptionsForPrintingType(printingTypeValue);

  if (mediaTypeValue === "Couche") {
    return baseOptions.filter((option) => option !== "75g");
  }

  if (["Vinil Fosco", "Vinil Brilho", "Vinil Transparente"].includes(mediaTypeValue)) {
    return baseOptions.includes("0.10") ? baseOptions : [...baseOptions, "0.10"];
  }

  return baseOptions;
}

function resolveLegacySizeToPreset(value: string): string | null {
  const normalized = value.trim().toUpperCase();
  const matched = sizeOptions.find((option) => option.startsWith(`${normalized} - `));
  return matched ?? null;
}

function parseMediaSelection(value: string) {
  const separatorIndex = value.lastIndexOf(" - ");
  if (separatorIndex === -1) {
    return { mediaType: value, gramatura: "" };
  }

  return {
    mediaType: value.slice(0, separatorIndex),
    gramatura: value.slice(separatorIndex + 3),
  };
}

export function OrcamentoMateriaisLaser({ }: OrcamentoMateriaisLaserProps) {
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [mediaType, setMediaType] = useState("");
  const [customMediaType, setCustomMediaType] = useState("");
  const [mediaTypeMode, setMediaTypeMode] = useState<"preset" | "custom">("preset");
  const [gramatura, setGramatura] = useState("");
  const [customGramatura, setCustomGramatura] = useState("");
  const [gramaturaMode, setGramaturaMode] = useState<"preset" | "custom">("preset");
  const [printingType, setPrintingType] = useState("");
  const [customPrintingType, setCustomPrintingType] = useState("");
  const [printingTypeMode, setPrintingTypeMode] = useState<"preset" | "custom">("preset");
  const [size, setSize] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [sizeMode, setSizeMode] = useState<"preset" | "custom">("preset");
  const [finishing, setFinishing] = useState("");
  const [customFinishing, setCustomFinishing] = useState("");
  const [finishingMode, setFinishingMode] = useState<"preset" | "custom">("preset");
  const [estimatedDeadline, setEstimatedDeadline] = useState("");
  const [paymentCondition, setPaymentCondition] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<LaserQuoteItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<number | null>(null);

  const resetForm = () => {
    setCustomerName("");
    setQuantity("1");
    setMediaType("");
    setCustomMediaType("");
    setMediaTypeMode("preset");
    setGramatura("");
    setCustomGramatura("");
    setGramaturaMode("preset");
    setPrintingType("");
    setCustomPrintingType("");
    setPrintingTypeMode("preset");
    setSize("");
    setCustomSize("");
    setSizeMode("preset");
    setFinishing("");
    setCustomFinishing("");
    setFinishingMode("preset");
    setEstimatedDeadline("");
    setPaymentCondition("");
    setUnitPrice("");
    setNote("");
    setEditingItemId(null);
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(normalizeQuantity(value));
  };

  const incrementQuantity = () => {
    const current = Number.parseInt(quantity, 10) || 1;
    setQuantity(String(Math.min(9999, current + 1)));
  };

  const decrementQuantity = () => {
    const current = Number.parseInt(quantity, 10) || 1;
    setQuantity(String(Math.max(1, current - 1)));
  };

  const handleAddOrUpdateItem = () => {
    setErrorMessage(null);

    const parsedQuantity = Number.parseInt(quantity, 10);
    const parsedPrice = parseCurrencyInput(unitPrice);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage("Informe uma quantidade válida.");
      return;
    }

    const finalPrintingType = printingTypeMode === "custom" ? customPrintingType.trim() : printingType.trim();
    const finalMediaType = mediaTypeMode === "custom" ? customMediaType.trim() : mediaType.trim();
    const finalGramatura = gramaturaMode === "custom" ? customGramatura.trim() : gramatura.trim();

    if (!finalMediaType) {
      setErrorMessage("Informe o tipo de mídia.");
      return;
    }

    if (!finalGramatura) {
      setErrorMessage("Informe a gramatura.");
      return;
    }

    if (!finalPrintingType) {
      setErrorMessage("Informe o tipo de impressão.");
      return;
    }

    const finalSize = sizeMode === "custom" ? customSize.trim() : size.trim();
    const finalFinishing = finishingMode === "custom" ? customFinishing.trim() : finishing.trim();

    if (!finalSize) {
      setErrorMessage("Informe o tamanho.");
      return;
    }

    if (!finalFinishing) {
      setErrorMessage("Informe o acabamento.");
      return;
    }

    if (!estimatedDeadline.trim()) {
      setErrorMessage("Informe o prazo estimado.");
      return;
    }

    if (!paymentCondition.trim()) {
      setErrorMessage("Informe a condição de pagamento.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Informe um valor unitário válido.");
      return;
    }

    const newItem: LaserQuoteItem = {
      id: editingItemId ?? Date.now(),
      material: customerName.trim(),
      quantity: parsedQuantity,
      mediaType: `${finalMediaType} - ${finalGramatura}`,
      printingType: finalPrintingType,
      size: finalSize,
      finishing: finalFinishing,
      estimatedDeadline: estimatedDeadline.trim(),
      paymentCondition: paymentCondition.trim(),
      unitPrice: parsedPrice,
      note: note.trim(),
    };

    if (editingItemId !== null) {
      setItems((prev) => prev.map((item) => (item.id === editingItemId ? newItem : item)));
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    resetForm();
  };

  const startEditItem = (item: LaserQuoteItem) => {
    setEditingItemId(item.id);
    setCustomerName(item.material);
    setQuantity(String(item.quantity));
    const parsedMedia = parseMediaSelection(item.mediaType);
    const resolvedPrintingType = printingTypeOptions.includes(item.printingType) ? item.printingType : null;
    const availableMediaForPrintingType = resolvedPrintingType ? getMediaTypeOptionsForPrintingType(resolvedPrintingType) : [];
    const availableGramaturaForPrintingType = resolvedPrintingType ? getGramaturaOptions(resolvedPrintingType, parsedMedia.mediaType) : [];

    if (resolvedPrintingType) {
      setPrintingType(resolvedPrintingType);
      setCustomPrintingType("");
      setPrintingTypeMode("preset");
    } else {
      setPrintingType("");
      setCustomPrintingType(item.printingType);
      setPrintingTypeMode("custom");
    }

    const knownMedia = availableMediaForPrintingType.includes(parsedMedia.mediaType);
    if (knownMedia) {
      setMediaType(parsedMedia.mediaType);
      setCustomMediaType("");
      setMediaTypeMode("preset");
    } else {
      setMediaType("");
      setCustomMediaType(parsedMedia.mediaType);
      setMediaTypeMode("custom");
    }

    if (availableGramaturaForPrintingType.includes(parsedMedia.gramatura)) {
      setGramatura(parsedMedia.gramatura);
      setCustomGramatura("");
      setGramaturaMode("preset");
    } else {
      setGramatura("");
      setCustomGramatura(parsedMedia.gramatura);
      setGramaturaMode(parsedMedia.gramatura ? "custom" : "preset");
    }

    const resolvedSize = sizeOptions.includes(item.size) ? item.size : resolveLegacySizeToPreset(item.size);
    if (resolvedSize) {
      setSize(resolvedSize);
      setCustomSize("");
      setSizeMode("preset");
    } else {
      setSize("");
      setCustomSize(item.size);
      setSizeMode("custom");
    }
    if (finishingOptions.includes(item.finishing)) {
      setFinishing(item.finishing);
      setCustomFinishing("");
      setFinishingMode("preset");
    } else {
      setFinishing("");
      setCustomFinishing(item.finishing);
      setFinishingMode("custom");
    }
    setEstimatedDeadline(item.estimatedDeadline);
    setPaymentCondition(item.paymentCondition);
    setUnitPrice(item.unitPrice.toFixed(2).replace(".", ","));
    setNote(item.note);
    setErrorMessage(null);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItemId === id) {
      resetForm();
    }
  };

  const buildItemPlainTextMessage = (item: LaserQuoteItem): string => {
    const date = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    const itemTotal = item.quantity * item.unitPrice;
    const lines: string[] = [
      "Orçamento",
      `Data: ${date}`,
      `Material: ${item.material}`,
      `Quantidade: ${item.quantity}`,
      `Tipo de Mídia: ${item.mediaType}`,
      `Tipo Impressão: ${item.printingType}`,
      `Tamanho: ${item.size}`,
      `Acabamento: ${item.finishing}`,
      `Prazo estimado: ${item.estimatedDeadline}`,
      `Valor unitário: ${formatCurrency(item.unitPrice)}`,
      `Condição de pagamento: ${item.paymentCondition}`,
      `Valor total: ${formatCurrency(itemTotal)}`,
    ];

    if (item.note) {
      lines.push(`* ${item.note}`);
    }

    return lines.join("\n");
  };

  const handleCopyItemPlainText = async (item: LaserQuoteItem) => {
    try {
      await navigator.clipboard.writeText(buildItemPlainTextMessage(item));
      setCopiedItemId(item.id);
      window.setTimeout(() => setCopiedItemId(null), 1800);
    } catch {
      setCopiedItemId(null);
    }
  };

  const selectedPrintingValue = printingTypeMode === "custom" ? customPrintingType.trim() : printingType.trim();
  const selectedMediaValue = mediaTypeMode === "custom" ? customMediaType.trim() : mediaType.trim();
  const availableMediaTypeOptions = getMediaTypeOptionsForPrintingType(selectedPrintingValue);
  const availableGramaturaOptions = getGramaturaOptions(selectedPrintingValue, selectedMediaValue);
  const parsedQuantityPreview = Number.parseInt(quantity, 10);
  const parsedUnitPricePreview = parseCurrencyInput(unitPrice);
  const itemPreviewTotal =
    Number.isFinite(parsedQuantityPreview) && Number.isFinite(parsedUnitPricePreview)
      ? parsedQuantityPreview * parsedUnitPricePreview
      : 0;
  const itemsTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  return (
    <section className="rounded-4xl border border-[#c9d8ea] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] p-5 shadow-[0_14px_35px_rgba(19,38,68,0.08)] sm:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2d63a8]">Orçamento Laser e Offset</p>
        <h2 className="font-heading text-2xl font-bold text-[#123355] sm:text-3xl">Monte o orçamento item por item</h2>
        <p className="max-w-3xl text-sm leading-6 text-[#4f6988] sm:text-base">
          Preencha os dados do material, ajuste quantidade e valor unitário, e adicione quantos itens precisar.
          O total da proposta é atualizado automaticamente.
        </p>
      </div>

      <div className="mt-6">
        <div className="space-y-4 rounded-3xl border border-[#e2ebf5] bg-white/80 p-4 shadow-[0_10px_24px_rgba(19,38,68,0.04)] sm:p-5">
          <p className="rounded-2xl border border-[#dbe7f4] bg-[#f5f9ff] px-3 py-2 text-xs font-medium text-[#365a81]">
            Dica: primeiro selecione o tipo de impressão para liberar automaticamente as opções de mídia e gramatura.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Material / Serviço</span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: Folder"
              />
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Tamanho</span>
              <div className="space-y-3 rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] p-3">
                <select
                  value={sizeMode === "custom" ? "custom" : size}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (nextValue === "custom") {
                      setSize("");
                      setCustomSize("");
                      setSizeMode("custom");
                      return;
                    }

                    setSize(nextValue);
                    setCustomSize("");
                    setSizeMode("preset");
                  }}
                  className="w-full rounded-2xl border border-[#cfdcf0] bg-white px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                >
                  <option value="">Selecione um tamanho</option>
                  {sizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">Outros</option>
                </select>

                {sizeMode === "custom" ? (
                  <div className="rounded-2xl border border-dashed border-[#cfdcf0] bg-white/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7695]">Outros</label>
                    <input
                      value={customSize}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setCustomSize(nextValue);
                        setSize(nextValue);
                      }}
                      className="mt-2 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                      placeholder="Ex: 10x15cm"
                    />
                  </div>
                ) : null}
              </div>
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Tipo Impressão</span>
              <div className="space-y-3 rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] p-3">
                <select
                  value={printingTypeMode === "custom" ? "custom" : printingType}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (nextValue === "custom") {
                      setPrintingType("");
                      setCustomPrintingType("");
                      setPrintingTypeMode("custom");
                      setMediaType("");
                      setCustomMediaType("");
                      setMediaTypeMode("preset");
                      return;
                    }

                    setPrintingType(nextValue);
                    setCustomPrintingType("");
                    setPrintingTypeMode("preset");
                    setMediaType("");
                    setCustomMediaType("");
                    setMediaTypeMode("preset");
                  }}
                  className="w-full rounded-2xl border border-[#cfdcf0] bg-white px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                >
                  <option value="">Selecione uma impressão</option>
                  {printingTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">Outros</option>
                </select>

                {printingTypeMode === "custom" ? (
                  <div className="rounded-2xl border border-dashed border-[#cfdcf0] bg-white/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7695]">Outros</label>
                    <input
                      value={customPrintingType}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setCustomPrintingType(nextValue);
                        setPrintingType(nextValue);
                      }}
                      className="mt-2 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                      placeholder="Ex: Impressão especial"
                    />
                  </div>
                ) : null}
              </div>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Tipo de Mídia</span>
              <div className="space-y-3 rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] p-3">
                <select
                  value={mediaTypeMode === "custom" ? "custom" : mediaType}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (nextValue === "custom") {
                      setMediaType("");
                      setCustomMediaType("");
                      setMediaTypeMode("custom");
                      setGramatura("");
                      setCustomGramatura("");
                      setGramaturaMode("preset");
                      return;
                    }

                    setMediaType(nextValue);
                    setCustomMediaType("");
                    setMediaTypeMode("preset");
                    setGramatura("");
                    setCustomGramatura("");
                    setGramaturaMode("preset");
                  }}
                  className="w-full rounded-2xl border border-[#cfdcf0] bg-white px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                  disabled={!selectedPrintingValue}
                >
                  <option value="">{selectedPrintingValue ? "Selecione uma mídia" : "Selecione a impressão primeiro"}</option>
                  {availableMediaTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">Outros</option>
                </select>

                {mediaTypeMode === "custom" ? (
                  <div className="rounded-2xl border border-dashed border-[#cfdcf0] bg-white/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7695]">Outros</label>
                    <input
                      value={customMediaType}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setCustomMediaType(nextValue);
                        setMediaType(nextValue);
                        setGramatura("");
                        setCustomGramatura("");
                        setGramaturaMode("preset");
                      }}
                      className="mt-2 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                      placeholder="Ex: Papel especial"
                    />
                  </div>
                ) : null}
              </div>
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Gramatura</span>
              <div className="space-y-3 rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] p-3">
                <select
                  value={gramaturaMode === "custom" ? "custom" : gramatura}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (nextValue === "custom") {
                      setGramatura("");
                      setCustomGramatura("");
                      setGramaturaMode("custom");
                      return;
                    }

                    setGramatura(nextValue);
                    setCustomGramatura("");
                    setGramaturaMode("preset");
                  }}
                  className="w-full rounded-2xl border border-[#cfdcf0] bg-white px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                  disabled={!selectedPrintingValue}
                >
                  <option value="">{selectedPrintingValue ? "Selecione uma gramatura" : "Selecione a impressão primeiro"}</option>
                  {availableGramaturaOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">Outros</option>
                </select>

                {gramaturaMode === "custom" ? (
                  <div className="rounded-2xl border border-dashed border-[#cfdcf0] bg-white/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7695]">Outros</label>
                    <input
                      value={customGramatura}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setCustomGramatura(nextValue);
                        setGramatura(nextValue);
                      }}
                      className="mt-2 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                      placeholder="Ex: 300g"
                    />
                  </div>
                ) : null}
              </div>
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Acabamento</span>
              <div className="space-y-3 rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] p-3">
                <select
                  value={finishingMode === "custom" ? "custom" : finishing}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (nextValue === "custom") {
                      setFinishing("");
                      setCustomFinishing("");
                      setFinishingMode("custom");
                      return;
                    }

                    setFinishing(nextValue);
                    setCustomFinishing("");
                    setFinishingMode("preset");
                  }}
                  className="w-full rounded-2xl border border-[#cfdcf0] bg-white px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                >
                  <option value="">Selecione um acabamento</option>
                  {finishingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">Outros</option>
                </select>

                {finishingMode === "custom" ? (
                  <div className="rounded-2xl border border-dashed border-[#cfdcf0] bg-white/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7695]">Outros</label>
                    <input
                      value={customFinishing}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setCustomFinishing(nextValue);
                        setFinishing(nextValue);
                      }}
                      className="mt-2 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                      placeholder="Ex: Encadernação especial"
                    />
                  </div>
                ) : null}
              </div>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Quantidade</span>
              <div className="mt-1.5 flex h-12 w-full items-center rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] shadow-[inset_0_1px_2px_rgba(18,42,72,0.05)]">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={decrementQuantity}
                  className="inline-flex h-full w-12 items-center justify-center rounded-l-2xl border-r border-[#d5deea] text-[1.2rem] font-semibold text-[#31567d] transition hover:bg-[#e8eef7]"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  className="h-full w-full bg-transparent px-2 text-center text-[1.15rem] font-semibold text-[#203653] outline-none"
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  onBlur={() => {
                    if (!quantity) setQuantity("1");
                  }}
                  placeholder="1"
                />
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={incrementQuantity}
                  className="inline-flex h-full w-12 items-center justify-center rounded-r-2xl border-l border-[#d5deea] text-[1.2rem] font-semibold text-[#31567d] transition hover:bg-[#e8eef7]"
                >
                  +
                </button>
              </div>
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Prazo estimado</span>
              <input
                value={estimatedDeadline}
                onChange={(event) => setEstimatedDeadline(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: 02 a 03 dias"
              />
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Valor unitário</span>
              <input
                type="text"
                inputMode="decimal"
                value={unitPrice}
                onChange={(event) => setUnitPrice(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: 15,00"
              />
            </label>
          </div>

          <div className="grid gap-4">
            <label className="block text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Condição de pagamento</span>
              <input
                value={paymentCondition}
                onChange={(event) => setPaymentCondition(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: 50% entrada e 50% na retirada"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-[#26415f]">
            <span className="mb-2 block">Observação do item</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-24 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
              placeholder="Detalhes extras para o cliente"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl border border-[#f4d8c5] bg-[#fff7f2] px-3 py-2 text-sm font-medium text-[#b54708]">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddOrUpdateItem}
              className="rounded-full bg-[#79a2e3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#668fd3]"
            >
              {editingItemId ? "Salvar item" : "Adicionar item"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[#c9d8ea] px-4 py-2 text-sm font-semibold text-[#2d63a8] transition hover:bg-[#f4f8ff]"
            >
              Limpar
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#cfe0f5] bg-[linear-gradient(135deg,#eef5ff_0%,#f8fbff_100%)] p-4 shadow-[0_8px_18px_rgba(19,38,68,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Prévia do item</p>
              <p className="mt-2 text-2xl font-bold text-[#15375d]">{formatCurrency(itemPreviewTotal)}</p>
              <p className="mt-1 text-xs text-[#6883a2]">Baseado na quantidade e valor unitário preenchidos</p>
            </div>
            <div className="rounded-2xl border border-[#cde8dd] bg-[linear-gradient(135deg,#eefaf3_0%,#f8fdf9_100%)] p-4 shadow-[0_8px_18px_rgba(19,38,68,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Itens adicionados</p>
              <p className="mt-2 text-2xl font-bold text-[#15375d]">{items.length}</p>
              <p className="mt-1 text-xs text-[#6883a2]">Quantidade de linhas no orçamento atual</p>
            </div>
            <div className="rounded-2xl border border-[#f0debf] bg-[linear-gradient(135deg,#fff6e9_0%,#fffdfa_100%)] p-4 shadow-[0_8px_18px_rgba(19,38,68,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Total acumulado</p>
              <p className="mt-2 text-2xl font-bold text-[#15375d]">{formatCurrency(itemsTotal)}</p>
              <p className="mt-1 text-xs text-[#6883a2]">Soma de todos os itens adicionados</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dbe7f4] bg-white p-3 text-sm text-[#385979] sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-[#193a62]">Itens adicionados</p>
              <p className="rounded-full bg-[#f3f8ff] px-3 py-1 text-xs font-semibold text-[#2d63a8]">
                Total: {formatCurrency(itemsTotal)}
              </p>
            </div>
            {items.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-[#d5e3f2] bg-[#fafcff] px-3 py-4 text-sm text-[#5f7390]">
                Ainda não há itens para orçamento. Preencha os campos acima e clique em adicionar item.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="space-y-2">
                    <div className="rounded-2xl border border-[#ebf2fa] bg-[#f9fbff] p-3 sm:p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#193a62]">{item.material || "Item sem nome"}</p>
                        <p className="text-sm font-bold text-[#173354]">{formatCurrency(item.quantity * item.unitPrice)}</p>
                      </div>
                      <div className="grid gap-1 sm:grid-cols-2">
                        <p className="text-sm text-[#5f7390]">Material: {item.material}</p>
                        <p className="text-sm text-[#5f7390]">Quantidade: {item.quantity}</p>
                        <p className="text-sm text-[#5f7390]">Tipo de Mídia: {item.mediaType}</p>
                        <p className="text-sm text-[#5f7390]">Tipo Impressão: {item.printingType}</p>
                        <p className="text-sm text-[#5f7390]">Tamanho: {item.size}</p>
                        <p className="text-sm text-[#5f7390]">Acabamento: {item.finishing}</p>
                        <p className="text-sm text-[#5f7390]">Prazo estimado: {item.estimatedDeadline}</p>
                        <p className="text-sm text-[#5f7390]">Valor unitário: {formatCurrency(item.unitPrice)}</p>
                        <p className="text-sm text-[#5f7390]">Condição de pagamento: {item.paymentCondition}</p>
                        <p className="text-sm font-semibold text-[#173354]">Valor total: {formatCurrency(item.quantity * item.unitPrice)}</p>
                        {item.note ? <p className="text-xs text-[#6b86a6]">* {item.note}</p> : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-start gap-2 px-1">
                      <button
                        type="button"
                        onClick={() => startEditItem(item)}
                        className="inline-flex items-center rounded-full border border-[#cfe0f3] bg-white px-4 py-2 text-sm font-semibold text-[#2d63a8] shadow-[0_6px_14px_rgba(19,38,68,0.05)] transition hover:border-[#b8d0ec] hover:bg-[#f5f9ff]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyItemPlainText(item)}
                        className="inline-flex items-center rounded-full border border-[#c9d8ea] bg-white px-4 py-2 text-sm font-semibold text-[#2d63a8] shadow-[0_6px_14px_rgba(19,38,68,0.05)] transition hover:border-[#b8d0ec] hover:bg-[#f5f9ff]"
                      >
                        {copiedItemId === item.id ? "Copiado" : "Copiar texto"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center rounded-full border border-[#f3d2c4] bg-white px-4 py-2 text-sm font-semibold text-[#c25a17] shadow-[0_6px_14px_rgba(19,38,68,0.05)] transition hover:border-[#efc0ac] hover:bg-[#fff7f2]"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
