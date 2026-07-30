"use client";

import { useState } from "react";

type LaserQuoteItem = {
  id: number;
  material: string;
  quantity: number;
  mediaType: string;
  printingType: string;
  size: string;
  finishing: string;
  estimatedDeadline: string;
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

export function OrcamentoMateriaisLaser({ }: OrcamentoMateriaisLaserProps) {
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [mediaType, setMediaType] = useState("");
  const [printingType, setPrintingType] = useState("");
  const [size, setSize] = useState("");
  const [finishing, setFinishing] = useState("");
  const [estimatedDeadline, setEstimatedDeadline] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<LaserQuoteItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setQuantity("1");
    setMediaType("");
    setPrintingType("");
    setSize("");
    setFinishing("");
    setEstimatedDeadline("");
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

    if (!mediaType.trim()) {
      setErrorMessage("Informe o tipo de mídia.");
      return;
    }

    if (!printingType.trim()) {
      setErrorMessage("Informe o tipo de impressão.");
      return;
    }

    if (!size.trim()) {
      setErrorMessage("Informe o tamanho.");
      return;
    }

    if (!finishing.trim()) {
      setErrorMessage("Informe o acabamento.");
      return;
    }

    if (!estimatedDeadline.trim()) {
      setErrorMessage("Informe o prazo estimado.");
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
      mediaType: mediaType.trim(),
      printingType: printingType.trim(),
      size: size.trim(),
      finishing: finishing.trim(),
      estimatedDeadline: estimatedDeadline.trim(),
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
    setMediaType(item.mediaType);
    setPrintingType(item.printingType);
    setSize(item.size);
    setFinishing(item.finishing);
    setEstimatedDeadline(item.estimatedDeadline);
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

  return (
    <section className="rounded-4xl border border-[#c9d8ea] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] p-5 shadow-[0_14px_35px_rgba(19,38,68,0.08)] sm:p-8">
      <div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2d63a8]">Orçamento Laser e Offset</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="space-y-4 rounded-3xl border border-[#e2ebf5] bg-white/80 p-4 shadow-[0_10px_24px_rgba(19,38,68,0.04)] sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Material</span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: Folder"
              />
            </label>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Tipo de Mídia</span>
              <input
                value={mediaType}
                onChange={(event) => setMediaType(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex.: Couchê 170g"
              />
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Tipo Impressão</span>
              <input
                value={printingType}
                onChange={(event) => setPrintingType(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: Laser"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Tamanho</span>
              <input
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: 10x15cm"
              />
            </label>
            <label className="text-sm font-medium text-[#26415f]">
              <span className="mb-2 block">Acabamento</span>
              <input
                value={finishing}
                onChange={(event) => setFinishing(event.target.value)}
                className="w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
                placeholder="Ex: Laminação Fosca"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

          <label className="block text-sm font-medium text-[#26415f]">
            <span className="mb-2 block">Observação do item</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-24 w-full rounded-2xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62] outline-none ring-0 focus:border-[#6b8fd3]"
              placeholder="Detalhes extras para o cliente"
            />
          </label>

          {errorMessage ? <p className="text-sm font-medium text-[#b54708]">{errorMessage}</p> : null}

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

          <div className="rounded-2xl border border-[#dbe7f4] bg-white p-3 text-sm text-[#385979]">
            <p className="font-semibold text-[#193a62]">Itens adicionados</p>
            {items.length === 0 ? (
              <p className="mt-2">Ainda não há itens para orçamento.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="space-y-2">
                    <div className="rounded-2xl border border-[#ebf2fa] bg-[#f9fbff] p-3">
                      <div className="space-y-1">
                        <p className="text-sm text-[#5f7390]">Material: {item.material}</p>
                        <p className="text-sm text-[#5f7390]">Quantidade: {item.quantity}</p>
                        <p className="text-sm text-[#5f7390]">Tipo de Mídia: {item.mediaType}</p>
                        <p className="text-sm text-[#5f7390]">Tipo Impressão: {item.printingType}</p>
                        <p className="text-sm text-[#5f7390]">Tamanho: {item.size}</p>
                        <p className="text-sm text-[#5f7390]">Acabamento: {item.finishing}</p>
                        <p className="text-sm text-[#5f7390]">Prazo estimado: {item.estimatedDeadline}</p>
                        <p className="text-sm text-[#5f7390]">Valor unitário: {formatCurrency(item.unitPrice)}</p>
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
