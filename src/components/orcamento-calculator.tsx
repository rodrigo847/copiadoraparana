"use client";

import jsPDF from "jspdf";
import autoTable, { type Styles } from "jspdf-autotable";
import { useMemo, useState } from "react";

type Unit = "mm" | "cm" | "m2";

type PriceLabel = {
  name: string;
  pricePerM2: number;
};

type BudgetItem = {
  id: number;
  height: number;
  width: number;
  unit: Unit;
  material: string;
  printingType: string;
  rigidMaterial: string;
  quantity: number;
  areaM2: number;
  unitPrice: number;
  totalPrice: number;
  finishing: string;
  verso: string;
  special: string;
};

type SpecialService = {
  name: string;
  unitPrice: number;
  height: number;
  width: number;
  unit: Unit;
  material: string;
  printingType: string;
  rigidMaterial: string;
  finishing: string;
  verso: string;
};

const MATERIALS: Record<string, PriceLabel> = {
  sem_material: { name: "Nao", pricePerM2: 0 },
  vinil_branco_fosco: { name: "Adesivo Vinil Fosco", pricePerM2: 35 },
  vinil_branco_brilho: { name: "Adesivo Vinil Brilho", pricePerM2: 35 },
  vinil_transparente_brilho: { name: "Adesivo Vinil Transparente", pricePerM2: 75 },
  papel_couche_fosco_150g: { name: "Couche/Offset 150g", pricePerM2: 1 },
  banner_brilho: { name: "Banner Brilho", pricePerM2: 35 },
  banner_fosco: { name: "Banner Fosco", pricePerM2: 35 },
};

const MATERIAL_ICONS: Record<string, string> = {
  sem_material: "🚫",
  vinil_branco_fosco: "⚪",
  vinil_branco_brilho: "⚪",
  vinil_transparente_brilho: "⚪",
  papel_couche_fosco_150g: "📄",
  banner_brilho: "🪧",
  banner_fosco: "🪧",
};

const RIGID_MATERIALS: Record<string, PriceLabel> = {
  sem_rigido: { name: "Nao", pricePerM2: 0 },
  forn_cliente: { name: "Material Cliente", pricePerM2: 200 },
  ps_1mm: { name: "PS 1mm", pricePerM2: 200 },
  ps_2mm: { name: "PS 2mm", pricePerM2: 250 },
  ps_3mm: { name: "PS 3mm", pricePerM2: 380 },
  acrilico_2mm: { name: "Acrilico 2mm", pricePerM2: 400 },
  acrilico_3mm: { name: "Acrilico 3mm", pricePerM2: 500 },
  //acrilico_6mm: { name: "Acrilico 6mm", pricePerM2: 1250 },
  c2s_triplex: { name: "Papel C2S Triplex", pricePerM2: 35 },
};

const RIGID_MATERIAL_ICONS: Record<string, string> = {
  sem_rigido: "🚫",
  forn_cliente: "👤",
  ps_1mm: "🗞️",
  ps_2mm: "🗞️",
  ps_3mm: "🗞️",
  acrilico_2mm: "📃",
  acrilico_3mm: "📃",
  c2s_triplex: "📦",
};

const PRINTING_TYPES: Record<string, PriceLabel> = {
  sem_impressao: { name: "Sem impressao", pricePerM2: 0 },
  eco_solvente: { name: "Eco-solvente", pricePerM2: 55 },
  uv: { name: "Imp. UV", pricePerM2: 95 },
};

const PRINTING_ICONS: Record<string, string> = {
  sem_impressao: "🚫",
  eco_solvente: "🖨️",
  uv: "💡",
};

const FINISHING_TYPES: Record<string, PriceLabel> = {
  sem_acabamento: { name: "Nenhum", pricePerM2: 0 },
  com_ilhos: { name: "Com Ilhos", pricePerM2: 10 },
  com_madeira: { name: "Com Madeira", pricePerM2: 10 },
  aplicacao_cavalete: { name: "Aplicacao em cavalete", pricePerM2: 60 },
  meio_corte: { name: "Meio corte", pricePerM2: 15 },
  corte_total: { name: "Corte Total", pricePerM2: 55 },
  corte_laser: { name: "Corte Laser", pricePerM2: 95 },
  corte_dobra: { name: "Corte + Dobra", pricePerM2: 150 },
};

const FINISHING_ICONS: Record<string, string> = {
  sem_acabamento: "🚫",
  com_ilhos: "◯",
  com_madeira: "🪧",
  aplicacao_cavalete: "🚧",
  meio_corte: "✂️",
  corte_total: "🧩",
  corte_laser: "⚡",
  corte_dobra: "📐",
};

const VERSO_TYPES: Record<string, PriceLabel> = {
  sem_verso: { name: "Sem verso", pricePerM2: 0 },
  com_verso: { name: "Com verso", pricePerM2: 50 },
};

const MINIMUM_PURCHASE = 60;
const UV_MINIMUM_SMALL_PIECE = 60;
const UV_MINIMUM_SIZE_LIMIT_CM = 6;
const UV_SMALL_PIECE_LABOR_SURCHARGE = 2.5;
const MIN_UNIT_PRICE_SMALL_PIECE = 0.08;
const MAX_QUANTITY = 100000;

const SPECIAL_SERVICES: Record<string, SpecialService> = {
  rollup_80x200: {
    name: "Roll-up 80x200cm",
    unitPrice: 350,
    height: 200,
    width: 80,
    unit: "cm",
    material: "banner_fosco",
    printingType: "eco_solvente",
    rigidMaterial: "sem_rigido",
    finishing: "sem_acabamento",
    verso: "sem_verso",
  },
};

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function sanitizeNonNegativeInput(value: string): string {
  return value.replace(/-/g, "");
}

function isUvSmallPiece(printingType: string, hCm: number, wCm: number): boolean {
  return (
    printingType === "uv" &&
    hCm <= UV_MINIMUM_SIZE_LIMIT_CM &&
    wCm <= UV_MINIMUM_SIZE_LIMIT_CM
  );
}

function getMinimumPurchaseForItem(printingType: string, hCm: number, wCm: number): number {
  if (isUvSmallPiece(printingType, hCm, wCm)) {
    return UV_MINIMUM_SMALL_PIECE;
  }

  return MINIMUM_PURCHASE;
}

type OrcamentoCalculatorProps = {
  whatsappHref: string;
};

export function OrcamentoCalculator({ whatsappHref }: OrcamentoCalculatorProps) {
  const [customerName, setCustomerName] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [unit, setUnit] = useState<Unit>("cm");
  const [material, setMaterial] = useState("sem_material");
  const [printingType, setPrintingType] = useState("sem_impressao");
  const [rigidMaterial, setRigidMaterial] = useState("sem_rigido");
  const [quantity, setQuantity] = useState("1");
  const [finishing, setFinishing] = useState("sem_acabamento");
  const [verso, setVerso] = useState("sem_verso");
  const [special, setSpecial] = useState("sem_especial");
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalBudget = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items]
  );

  const isSpecialSelected = special !== "sem_especial";
  const isPrintingSelected = printingType !== "sem_impressao";

  const minimumPerServiceHint = useMemo(() => {
    const h = Number.parseFloat(height);
    const w = Number.parseFloat(width);
    const qty = Number.parseInt(quantity, 10) || 1;

    if (qty <= 0) return null;

    if (isSpecialSelected) {
      const selectedSpecial = SPECIAL_SERVICES[special];
      if (!selectedSpecial) return null;

      const currentTotal = selectedSpecial.unitPrice * qty;
      if (currentTotal >= MINIMUM_PURCHASE) return null;

      const suggestedQty = Math.max(qty, Math.ceil(MINIMUM_PURCHASE / selectedSpecial.unitPrice));

      return {
        currentTotal,
        suggestedQty,
        suggestedTotal: selectedSpecial.unitPrice * suggestedQty,
        minimumPurchase: MINIMUM_PURCHASE,
      };
    }

    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;
    if (material === "sem_material" && rigidMaterial === "sem_rigido") return null;

    const hCm = toCm(h, unit);
    const wCm = toCm(w, unit);
    const areaM2 = toAreaM2(h, w, unit);
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

    if (unitPrice <= 0) return null;

    const itemMinimumPurchase = getMinimumPurchaseForItem(printingType, hCm, wCm);
    const currentTotal = unitPrice * qty;
    if (currentTotal >= itemMinimumPurchase) return null;

    const suggestedQty = Math.max(qty, Math.ceil(itemMinimumPurchase / unitPrice));

    return {
      currentTotal,
      suggestedQty,
      suggestedTotal: unitPrice * suggestedQty,
      minimumPurchase: itemMinimumPurchase,
    };
  }, [height, width, quantity, material, rigidMaterial, unit, printingType, finishing, verso, special, isSpecialSelected]);

  const minimumWarning = items.length > 0 && totalBudget < MINIMUM_PURCHASE;

  const whatsappBudgetHref = useMemo(() => {
    if (items.length === 0) return whatsappHref;


    // Monta o texto dos itens no formato numerado para WhatsApp
    const itemsText = items
      .map((item, idx) => {
        const impressao = PRINTING_TYPES[item.printingType]?.name || "-";
        const acabamento = FINISHING_TYPES[item.finishing]?.name || "-";
        const verso = VERSO_TYPES[item.verso]?.name || "-";
        const dimensoes = `${item.height}x${item.width}${item.unit}`;
        return `${idx + 1}. ${dimensoes} - ${item.quantity} un. - ${impressao} - ${acabamento} - ${verso} - Total: ${formatCurrency(item.totalPrice)}`;
      })
      .join("\n");

    const totalText = formatCurrency(totalBudget);
    const nomeCliente = customerName.trim() || "Nao informado";
    const dataAtual = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    let minimoAviso = "";
    if (items.length > 0 && totalBudget < MINIMUM_PURCHASE) {
      minimoAviso = `\n\nATENÇÃO: O valor mínimo para pedidos é de ${formatCurrency(MINIMUM_PURCHASE)}. Caso não deseje adicionar mais itens, este será o valor cobrado.`;
    }

    const message = `Orca Facil\n` +
      `Cliente: ${nomeCliente}\n` +
      `Data: ${dataAtual}\n\n` +
      `Itens:\n\n` +
      itemsText +
      minimoAviso +
      `\n\nTotal do Orcamento: ${totalText}` +
      `\n\nAguardando o retorno para validacao e fechamento. Obrigado.`;

    try {
      const parsed = new URL(whatsappHref);
      parsed.searchParams.set("text", message);
      return parsed.toString();
    } catch {
      return whatsappHref;
    }
  }, [customerName, items, totalBudget, whatsappHref]);

  const resetForm = () => {
    setHeight("");
    setWidth("");
    setQuantity("1");
    setFinishing("sem_acabamento");
    setVerso("sem_verso");
    setRigidMaterial("sem_rigido");
    setPrintingType("sem_impressao");
    setMaterial("sem_material");
    setSpecial("sem_especial");
    setEditingItemId(null);
  };

  const startEditItem = (item: BudgetItem) => {
    setErrorMessage(null);
    setEditingItemId(item.id);
    setHeight(String(item.height));
    setWidth(String(item.width));
    setUnit(item.unit);
    setMaterial(item.material);
    setPrintingType(item.printingType);
    setRigidMaterial(item.rigidMaterial);
    setQuantity(String(item.quantity));
    setFinishing(item.finishing);
    setVerso(item.verso);
    setSpecial(item.special || "sem_especial");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItemId === id) {
      resetForm();
    }
  };

  const handleQuantityChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") {
      setQuantity("");
      return;
    }

    const parsed = Number.parseInt(digitsOnly, 10);
    if (!Number.isFinite(parsed)) {
      setQuantity("1");
      return;
    }

    const normalized = Math.min(MAX_QUANTITY, Math.max(1, parsed));
    setQuantity(String(normalized));
  };

  const incrementQuantity = () => {
    const current = Number.parseInt(quantity, 10) || 1;
    setQuantity(String(Math.min(MAX_QUANTITY, current + 1)));
  };

  const decrementQuantity = () => {
    const current = Number.parseInt(quantity, 10) || 1;
    setQuantity(String(Math.max(1, current - 1)));
  };

  const addItem = () => {
    setErrorMessage(null);
    const h = Number.parseFloat(height);
    const w = Number.parseFloat(width);
    const qty = Number.parseInt(quantity, 10) || 1;

    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) {
      setErrorMessage("Informe altura e largura validas.");
      return;
    }

    if (qty <= 0 || qty > MAX_QUANTITY) {
      setErrorMessage(`Quantidade deve ser entre 1 e ${MAX_QUANTITY}.`);
      return;
    }

    if (isSpecialSelected) {
      const selectedSpecial = SPECIAL_SERVICES[special];
      if (!selectedSpecial) {
        setErrorMessage("Especial selecionado é inválido.");
        return;
      }

      const areaM2 = toAreaM2(selectedSpecial.height, selectedSpecial.width, selectedSpecial.unit);
      const unitPrice = selectedSpecial.unitPrice;
      const totalPrice = unitPrice * qty;

      const item: BudgetItem = {
        id: editingItemId ?? Date.now(),
        height: selectedSpecial.height,
        width: selectedSpecial.width,
        unit: selectedSpecial.unit,
        material: selectedSpecial.material,
        printingType: selectedSpecial.printingType,
        rigidMaterial: selectedSpecial.rigidMaterial,
        quantity: qty,
        areaM2,
        unitPrice,
        totalPrice,
        finishing: selectedSpecial.finishing,
        verso: selectedSpecial.verso,
        special,
      };

      if (editingItemId !== null) {
        setItems((prev) => prev.map((current) => (current.id === editingItemId ? item : current)));
      } else {
        setItems((prev) => [...prev, item]);
      }

      resetForm();
      return;
    }

    if (material === "sem_material" && rigidMaterial === "sem_rigido") {
      setErrorMessage("Selecione Adesivo ou Material Rigido.");
      return;
    }

    const hCm = toCm(h, unit);
    const wCm = toCm(w, unit);

    if (printingType === "uv" && (hCm > 60 || wCm > 90)) {
      setErrorMessage("Impressao UV: maximo 60cm x 90cm.");
      return;
    }

    if (printingType === "eco_solvente" && (hCm > 180 || wCm > 5000)) {
      setErrorMessage("Eco-solvente: maximo 1,80m x 50m.");
      return;
    }

    if (printingType === "eco_solvente" && rigidMaterial !== "sem_rigido") {
      setErrorMessage("Eco-solvente permite apenas Adesivo/Banner (sem material rigido).");
      return;
    }

    if (printingType === "uv" && material !== "sem_material") {
      setErrorMessage("Impressao UV permite apenas material rigido (sem adesivo/banner).");
      return;
    }

    if (rigidMaterial !== "sem_rigido" && printingType !== "uv" && printingType !== "sem_impressao") {
      setErrorMessage("Para material rigido, selecione impressao UV ou sem impressao.");
      return;
    }

    if (verso === "com_verso" && printingType === "sem_impressao") {
      setErrorMessage("Para incluir verso, selecione um tipo de impressao.");
      return;
    }

    const areaM2 = toAreaM2(h, w, unit);
    const materialPrice = MATERIALS[material]?.pricePerM2 ?? 0;
    // Acréscimo de acabamento para vinil fosco e brilho
   
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
    const rawTotalPrice = unitPrice * qty;
    const totalPrice = Math.max(rawTotalPrice, itemMinimumPurchase);
    const finalUnitPrice = totalPrice / qty;

    const item: BudgetItem = {
      id: editingItemId ?? Date.now(),
      height: h,
      width: w,
      unit,
      material,
      printingType,
      rigidMaterial,
      quantity: qty,
      areaM2,
      unitPrice: finalUnitPrice,
      totalPrice,
      finishing,
      verso,
      special: "sem_especial",
    };

    if (editingItemId !== null) {
      setItems((prev) => prev.map((current) => (current.id === editingItemId ? item : current)));
    } else {
      setItems((prev) => [...prev, item]);
    }

    resetForm();
  };

  const exportBudgetPdf = () => {
    if (items.length === 0) {
      setErrorMessage("Adicione ao menos um item antes de exportar o PDF.");
      return;
    }

    const doc = new jsPDF();
    const now = new Date();
    const customer = customerName.trim() || "Nao informado";

    const formatDateTime = (date: Date) =>
      new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);

    const validityDate = new Date(now);
    validityDate.setDate(validityDate.getDate() + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Orça Fácil | Copiadora Parana Laser", 105, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Data: ${formatDateTime(now)}`, 14, 30);
    doc.text(`Cliente: ${customer}`, 14, 36);
    doc.text(`Validade: ${validityDate.toLocaleDateString("pt-BR")}`, 195, 30, { align: "right" });

    const tableData = items.map((item, idx) => [
      String(idx + 1),
      `${item.height} x ${item.width} ${item.unit}`,
      MATERIALS[item.material]?.name || item.material,
      PRINTING_TYPES[item.printingType]?.name || item.printingType,
      RIGID_MATERIALS[item.rigidMaterial]?.name || item.rigidMaterial,
      FINISHING_TYPES[item.finishing]?.name || item.finishing,
      VERSO_TYPES[item.verso]?.name || item.verso,
      String(item.quantity),
      formatCurrency(item.unitPrice),
      formatCurrency(item.totalPrice),
    ]);

    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = pageWidth * 0.95;
    const sideMargin = (pageWidth - tableWidth) / 2;
    // Reduzir a largura da coluna '#' para o mínimo (ex: 7)
    const baseColumnWidths = [5, 15, 25, 16, 16, 20, 13, 15, 14, 17];
    const totalBaseWidth = baseColumnWidths.reduce((sum, value) => sum + value, 0);
    const scaledColumnWidths = baseColumnWidths.map((value) => (value * tableWidth) / totalBaseWidth);

    const columnStyles: Record<number, Partial<Styles>> = {
      0: { cellWidth: scaledColumnWidths[0] },
      1: { cellWidth: scaledColumnWidths[1] },
      2: { cellWidth: scaledColumnWidths[2] },
      3: { cellWidth: scaledColumnWidths[3], halign: "left" as const },
      4: { cellWidth: scaledColumnWidths[4], halign: "center" as const },
      5: { cellWidth: scaledColumnWidths[5], halign: "center" as const },
      6: { cellWidth: scaledColumnWidths[6], halign: "center" as const },
      7: { cellWidth: scaledColumnWidths[7], halign: "center" as const },
      8: { cellWidth: scaledColumnWidths[8], halign: "center" as const },
      9: { cellWidth: scaledColumnWidths[9], halign: "right" as const },
    };

    autoTable(doc, {
      startY: 42,
      margin: { left: sideMargin, right: sideMargin },
      tableWidth,
      head: [["#", "Tam.", "Adesivo", "Impressao", "Rigido", "Acabamento", "Verso", "Qtd", "Unit.", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 7,
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak",
      },
      didParseCell: (data) => {
        if (data.section !== "head") return;
        //alinhamento das colunas do cabeçalho pdf
        const columnIndex = data.column.index;
        if (columnIndex <= 2) {
          data.cell.styles.halign = "left";
        } else if (columnIndex >= 4 && columnIndex <= 9) {
          data.cell.styles.halign = "center";
        }
      },
      columnStyles,
    });

    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 96;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total do Orcamento: ${formatCurrency(totalBudget)}`, 195, finalY + 14, { align: "right" });

    let notesY = finalY + 24;

    if (totalBudget < MINIMUM_PURCHASE) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(163, 88, 10);
      doc.text(
        `Atenção: valor mínimo ${formatCurrency(MINIMUM_PURCHASE)}. Valor atual ${formatCurrency(totalBudget)}.`,
        14,
        notesY
      );
      notesY += 7;
    }

    if (items.some((item) => item.quantity >= 100000)) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 28, 28);
      doc.text(
        "Para grandes volumes, confirme prazo e produção pelo WhatsApp 41 99679-9517.",
        14,
        notesY
      );
      notesY += 6;
    }

    if (items.some((item) => item.rigidMaterial === "forn_cliente")) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(
        "Material do cliente deve seguir especificações técnicas para garantir qualidade.",
        14,
        notesY
      );
      notesY += 6;
    }

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Pagamento via PIX e envio de comprovante no WhatsApp.", 14, 270);
    doc.text("Produção em até 2 dias úteis após pagamento e aprovação dos arquivos.", 14, 275);
    doc.text("Copiadora Paraná Laser", 105, 283, { align: "center" });

    doc.save(`orcamento-${Date.now()}.pdf`);
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-[1.2rem] border border-[#c7d4e6] bg-[#f7f9fc] px-5 py-7 shadow-[0_12px_28px_rgba(19,38,68,0.08)] sm:px-7 sm:py-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center text-[#196feb]">
          <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="4" y="2.8" width="16" height="18.4" rx="2.6" />
            <path d="M8 7.2h8M8 10.2h8M8 13.2h8M12 17.2h.01" />
          </svg>
        </span>
        <h2 className="font-heading text-[0.9rem] tracking-tight text-[#0f1f39] sm:text-[1.5rem]">Dimensione o Material para Calcular</h2>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold text-[#102038] sm:col-span-2 lg:col-span-3">
          Nome do cliente
          <input
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Ex: João Silva"
          />
        </label>

        <label className="text-sm font-semibold text-[#102038]">
          Altura
          <input
            type="number"
            min={0}
            step="any"
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={height}
            disabled={isSpecialSelected}
            onKeyDown={(event) => {
              if (event.key === "-") {
                event.preventDefault();
              }
            }}
            onChange={(event) => setHeight(sanitizeNonNegativeInput(event.target.value))}
            placeholder="Ex: 10"
          />
        </label>

        <label className="text-sm font-semibold text-[#102038]">
          Largura
          <input
            type="number"
            min={0}
            step="any"
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={width}
            disabled={isSpecialSelected}
            onKeyDown={(event) => {
              if (event.key === "-") {
                event.preventDefault();
              }
            }}
            onChange={(event) => setWidth(sanitizeNonNegativeInput(event.target.value))}
            placeholder="Ex: 15"
          />
        </label>

        <label className="text-sm font-semibold text-[#102038]">
          Unidade
          <select
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={unit}
            disabled={isSpecialSelected}
            onChange={(event) => setUnit(event.target.value as Unit)}
          >
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="m2">m2</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-[#102038]">
          Impressao
          <select
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={printingType}
            disabled={isSpecialSelected}
            onChange={(event) => {
              const value = event.target.value;
              setPrintingType(value);
              if (value === "eco_solvente") {
                setRigidMaterial("sem_rigido");
                setVerso("sem_verso");
              }
              if (value === "uv") {
                setMaterial("sem_material");
              }
            }}
          >
            {Object.entries(PRINTING_TYPES)
              .filter(([key]) => {
                if (rigidMaterial !== "sem_rigido") {
                  return key === "uv" || key === "sem_impressao";
                }
                return true;
              })
              .map(([key, value]) => (
                <option key={key} value={key}>
                  {PRINTING_ICONS[key] ? `${PRINTING_ICONS[key]} ${value.name}` : value.name}
                </option>
              ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#102038]">
          Adesivo/Banner
          <select
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={material}
            onChange={(event) => {
              const value = event.target.value;
              setMaterial(value);
              if (value !== "sem_material") {
                setRigidMaterial("sem_rigido");
                setVerso("sem_verso");
              }
              // Sempre resetar acabamento para 'sem_acabamento' ao trocar material
              setFinishing("sem_acabamento");
            }}
            disabled={isSpecialSelected || rigidMaterial !== "sem_rigido" || printingType === "uv"}
          >
            {Object.entries(MATERIALS).map(([key, value]) => (
              <option key={key} value={key}>
                {MATERIAL_ICONS[key] ? `${MATERIAL_ICONS[key]} ${value.name}` : value.name}
              </option>
            ))}
          </select>
        </label>

        {material === "sem_material" && !isSpecialSelected ? (
          <label className="text-sm font-semibold text-[#102038]">
            Material rígido
            <select
              className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
              value={rigidMaterial}
              onChange={(event) => {
                const value = event.target.value;
                setRigidMaterial(value);
                if (value !== "sem_rigido") {
                  setMaterial("sem_material");
                  if (printingType === "eco_solvente") {
                    setPrintingType("sem_impressao");
                  }
                } else {
                  setVerso("sem_verso");
                }
              }}
            >
              {Object.entries(RIGID_MATERIALS).map(([key, value]) => (
                <option key={key} value={key}>
                  {RIGID_MATERIAL_ICONS[key] ? `${RIGID_MATERIAL_ICONS[key]} ${value.name}` : value.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="text-sm font-semibold text-[#102038]">
          Acabamento
          <select
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={finishing}
            onChange={(event) => setFinishing(event.target.value)}
            disabled={
              isSpecialSelected ||
              !(
                rigidMaterial !== "sem_rigido" ||
                material === "banner_brilho" ||
                material === "banner_fosco" ||
                material.startsWith("vinil_")
              )
            }
          >
            {Object.entries(FINISHING_TYPES)
              .filter(([key]) => {
                if (rigidMaterial !== "sem_rigido") {
                  if (rigidMaterial === "c2s_triplex") {
                    return key === "corte_total";
                  }

                  return key === "sem_acabamento" || key === "corte_laser" || key === "corte_dobra";
                }

                if (material === "banner_brilho" || material === "banner_fosco") {
                  return (
                    key === "sem_acabamento" ||
                    key === "com_ilhos" ||
                    key === "com_madeira" ||
                    key === "aplicacao_cavalete"
                  );
                }

                if (material.startsWith("vinil_")) {
                  return key === "sem_acabamento" || key === "meio_corte" || key === "corte_total";
                }

                return key === "sem_acabamento";
              })
              .map(([key, value]) => (
                <option key={key} value={key}>
                  {FINISHING_ICONS[key] ? `${FINISHING_ICONS[key]} ${value.name}` : value.name}
                </option>
              ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#102038]">
          Especiais
          <select
            className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
            value={special}
            disabled={!isSpecialSelected && isPrintingSelected}
            onChange={(event) => {
              const value = event.target.value;
              setSpecial(value);

              if (value !== "sem_especial") {
                const selectedSpecial = SPECIAL_SERVICES[value];
                if (!selectedSpecial) return;

                setHeight(String(selectedSpecial.height));
                setWidth(String(selectedSpecial.width));
                setUnit(selectedSpecial.unit);
                setMaterial(selectedSpecial.material);
                setPrintingType(selectedSpecial.printingType);
                setRigidMaterial(selectedSpecial.rigidMaterial);
                setFinishing(selectedSpecial.finishing);
                setVerso(selectedSpecial.verso);
              }
            }}
          >
            <option value="sem_especial">Nenhum</option>
            {Object.entries(SPECIAL_SERVICES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name} - {formatCurrency(value.unitPrice)}
              </option>
            ))}
          </select>
        </label>

        {rigidMaterial !== "sem_rigido" && !isSpecialSelected ? (
          <label className="text-sm font-semibold text-[#102038]">
            Verso
            <select
              className="mt-1.5 h-12 w-full rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] px-4 text-[1.05rem] font-normal text-[#203653] outline-none transition focus:border-[#77a6e7] sm:text-[1.1rem]"
              value={verso}
              onChange={(event) => setVerso(event.target.value)}
            >
              {Object.entries(VERSO_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="text-sm font-semibold text-[#102038]">
          Quantidade
          <div className="mt-1.5 flex h-12 w-full items-center rounded-2xl border border-[#c8d2df] bg-[#f1f4f8] shadow-[inset_0_1px_2px_rgba(18,42,72,0.05)] sm:max-w-48">
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

        {minimumPerServiceHint ? (
          <div className="rounded-xl border border-[#f1d486] bg-[#fff9e8] px-4 py-3 text-sm text-[#87621a] sm:col-span-2 lg:col-span-3">
            <p className="font-semibold">(i) Valor minimo por servico: {formatCurrency(minimumPerServiceHint.minimumPurchase)}.</p>
            <p>
              Com a quantidade atual, o item ficaria em {formatCurrency(minimumPerServiceHint.currentTotal)}.
              Sugestao: aumentar para {minimumPerServiceHint.suggestedQty} un. (estimativa de {formatCurrency(minimumPerServiceHint.suggestedTotal)}).
            </p>
          </div>
        ) : null}

        <div className="sm:col-span-2 lg:col-span-1 flex items-end gap-2">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#79a2e3] px-7 text-[1.05rem] font-semibold text-white transition hover:bg-[#668fd3] sm:text-[1.1rem]"
          >
            <span className="text-[1.25rem] leading-none">{editingItemId !== null ? "✓" : "+"}</span>
            {editingItemId !== null ? "Salvar edicao" : "Adicionar item"}
          </button>

          {editingItemId !== null ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#c8d2df] bg-white px-4 text-sm font-semibold text-[#385979] transition hover:bg-[#f3f7fc]"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-[#f5b3b3] bg-[#fff4f4] px-4 py-3 text-sm font-medium text-[#a22d2d]">
          {errorMessage}
        </div>
      ) : null}


      

      {minimumWarning ? (
        <div className="mt-4 rounded-xl border border-[#f1d486] bg-[#fff9e8] px-4 py-3 text-sm font-medium text-[#87621a]">
          Compra minima: {formatCurrency(MINIMUM_PURCHASE)}. Valor atual: {formatCurrency(totalBudget)}.
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#cfe1fa] bg-white">
        <table className="min-w-full text-left text-sm text-[#163a61]">
          <thead className="bg-[#f1f7ff] text-xs uppercase tracking-[0.04em] text-[#2b5683]">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Tamanho</th>
              <th className="px-3 py-2">Adesivo</th>
              <th className="px-3 py-2">Impressão</th>
              <th className="px-3 py-2">Rígido</th>
              <th className="px-3 py-2">Acabamento</th>
              <th className="px-3 py-2">Verso</th>
              <th className="px-3 py-2">Qtd</th>
              <th className="px-3 py-2">Unitário</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-[#54779e]" colSpan={11}>
                  Nenhum item adicionado.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="border-t border-[#e7f0fb]">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{item.height} x {item.width} {item.unit}</td>
                  <td className="px-3 py-2">{MATERIALS[item.material]?.name || item.material}</td>
                  <td className="px-3 py-2">{PRINTING_TYPES[item.printingType]?.name || item.printingType}</td>
                  <td className="px-3 py-2">{RIGID_MATERIALS[item.rigidMaterial]?.name || item.rigidMaterial}</td>
                  <td className="px-3 py-2">{FINISHING_TYPES[item.finishing]?.name || item.finishing}</td>
                  <td className="px-3 py-2">{VERSO_TYPES[item.verso]?.name || item.verso}</td>
                  <td className="px-3 py-2">{item.quantity}</td>
                  <td className="px-3 py-2">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-2">{formatCurrency(item.totalPrice)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditItem(item)}
                        className="rounded-lg border border-[#9fc0e8] bg-[#eef5ff] px-2.5 py-1 text-xs font-semibold text-[#245286] transition hover:bg-[#e3efff]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg border border-[#f0b6b6] bg-[#fff2f2] px-2.5 py-1 text-xs font-semibold text-[#a53a3a] transition hover:bg-[#ffe6e6]"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={exportBudgetPdf}
          className="inline-flex items-center justify-center rounded-full border border-[#7faee2] bg-white px-5 py-3 text-sm font-semibold text-[#0f3864] transition hover:bg-[#eff6ff]"
        >
          Baixar Orçamento PDF
        </button>
        <a
          href={whatsappBudgetHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-[#7faee2] bg-white px-5 py-3 text-sm font-semibold text-[#0f3864] transition hover:bg-[#eff6ff]"
        >
          Enviar resumo no WhatsApp
        </a>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-2 rounded-2xl border border-[#cfe1fa] bg-[#f7fbff] px-4 py-3 sm:flex-row sm:items-center">
        <span className="text-sm text-[#335981]">Total estimado</span>
        <strong className="font-heading text-2xl text-[#0f3864]">{formatCurrency(totalBudget)}</strong>
      </div>
    </section>
  );
}
