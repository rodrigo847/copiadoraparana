export type Unit = "mm" | "cm" | "m2";

export type PriceLabel = {
  name: string;
  pricePerM2: number;
};

export const MATERIALS: Record<string, PriceLabel> = {
  sem_material: { name: "Nao", pricePerM2: 0 },
  vinil_branco_fosco: { name: "Adesivo Vinil Fosco", pricePerM2: 35 },
  vinil_branco_brilho: { name: "Adesivo Vinil Brilho", pricePerM2: 35 },
  vinil_transparente_brilho: { name: "Adesivo Vinil Transparente", pricePerM2: 75 },
  papel_couche_fosco_150g: { name: "Couche/Offset 150g", pricePerM2: 1 },
  banner_brilho: { name: "Banner Brilho", pricePerM2: 35 },
  banner_fosco: { name: "Banner Fosco", pricePerM2: 35 },
};

export const RIGID_MATERIALS: Record<string, PriceLabel> = {
  sem_rigido: { name: "Nao", pricePerM2: 0 },
  forn_cliente: { name: "Material Cliente", pricePerM2: 200 },
  ps_1mm: { name: "PS 1mm", pricePerM2: 200 },
  ps_2mm: { name: "PS 2mm", pricePerM2: 300 },
  ps_3mm: { name: "PS 3mm", pricePerM2: 420 },
  acrilico_2mm: { name: "Acrilico 2mm", pricePerM2: 450 },
  acrilico_3mm: { name: "Acrilico 3mm", pricePerM2: 580 },
  c2s_triplex: { name: "Papel C2S Triplex", pricePerM2: 45 },
};

export const PRINTING_TYPES: Record<string, PriceLabel> = {
  sem_impressao: { name: "Sem impressao", pricePerM2: 0 },
  eco_solvente: { name: "Eco-solvente", pricePerM2: 60 },
  uv: { name: "Imp. UV", pricePerM2: 95 },
};

export const FINISHING_TYPES: Record<string, PriceLabel> = {
  sem_acabamento: { name: "Nenhum", pricePerM2: 0 },
  com_ilhos: { name: "Com Ilhos", pricePerM2: 10 },
  com_madeira: { name: "Com Madeira", pricePerM2: 10 },
  aplicacao_cavalete: { name: "Aplicacao em cavalete", pricePerM2: 60 },
  meio_corte: { name: "Meio corte", pricePerM2: 15 },
  corte_total: { name: "Corte Total", pricePerM2: 55 },
  corte_laser: { name: "Corte Laser", pricePerM2: 95 },
  corte_dobra: { name: "Corte + Dobra", pricePerM2: 150 },
};

export const VERSO_TYPES: Record<string, PriceLabel> = {
  sem_verso: { name: "Sem verso", pricePerM2: 0 },
  com_verso: { name: "Com verso", pricePerM2: 60 },
};

export const MINIMUM_PURCHASE = 60;
export const UV_MINIMUM_SMALL_PIECE = 60;
export const UV_MINIMUM_SIZE_LIMIT_CM = 6;
export const UV_SMALL_PIECE_LABOR_SURCHARGE = 2.5;
export const MIN_UNIT_PRICE_SMALL_PIECE = 0.08;
export const MAX_QUANTITY = 100000;
export const BANNER_MIN_SIDE_SMALL_CM = 60;
export const BANNER_MIN_SIDE_LARGE_CM = 80;

export function isUvSmallPiece(printingType: string, hCm: number, wCm: number): boolean {
  return (
    printingType === "uv" &&
    hCm <= UV_MINIMUM_SIZE_LIMIT_CM &&
    wCm <= UV_MINIMUM_SIZE_LIMIT_CM
  );
}

export function getMinimumPurchaseForItem(printingType: string, hCm: number, wCm: number): number {
  if (isUvSmallPiece(printingType, hCm, wCm)) {
    return UV_MINIMUM_SMALL_PIECE;
  }

  return MINIMUM_PURCHASE;
}

export function isBannerMaterial(material: string): boolean {
  return material === "banner_brilho" || material === "banner_fosco";
}

export function isValidBannerSize(hCm: number, wCm: number): boolean {
  const smallSide = Math.min(hCm, wCm);
  const largeSide = Math.max(hCm, wCm);
  return smallSide >= BANNER_MIN_SIDE_SMALL_CM && largeSide >= BANNER_MIN_SIDE_LARGE_CM;
}
