import assert from "node:assert/strict";
import test from "node:test";
import {
  getEffectiveAreaM2,
  getManuseioPricePerUnit,
  getMinimumPurchaseForItem,
  getPrintingPricePerM2,
  getSmallPiecePriceMultiplier,
  getUnitPriceWithSmallPieceMinimum,
  PRINTING_TYPES,
} from "./orcamento-pricing.ts";

test("UV dobra apenas a tarifa de pecas com area de ate 560cm2", () => {
  for (const [heightCm, widthCm] of [[10, 10], [20, 28], [28, 20], [10, 50], [14, 40], [1, 1]]) {
    const areaM2 = (heightCm / 100) * (widthCm / 100);
    assert.equal(getPrintingPricePerM2("uv", areaM2), 190);
  }
});

test("UV inclui o limite em cm, mm e metros", () => {
  const areas = [
    20 * 0.01 * (28 * 0.01),
    200 * 0.001 * (280 * 0.001),
    0.2 * 0.28,
    560 / 10000,
  ];
  for (const areaM2 of areas) {
    assert.equal(getPrintingPricePerM2("uv", areaM2), 190);
  }
});

test("UV mantem a tarifa original acima do limite", () => {
  for (const areaM2 of [20 * 28.001 / 10000, 21 * 28 / 10000, 30 * 30 / 10000, 1]) {
    assert.equal(getPrintingPricePerM2("uv", areaM2), 95);
  }
});

test("outros tipos de impressao nao recebem o multiplicador", () => {
  for (const areaM2 of [0.01, 0.056, 1]) {
    assert.equal(getPrintingPricePerM2("eco_solvente", areaM2), 60);
    assert.equal(getPrintingPricePerM2("sem_impressao", areaM2), 0);
  }
  assert.equal(PRINTING_TYPES.uv.pricePerM2, 95);
});

test("o acrescimo e apenas da impressao e por peca, sem dobrar outros custos", () => {
  const areaM2 = 0.01;
  const materialPrice = 300;
  const finishingPrice = 95;
  const optionalFinishingPrice = 80;
  const versoPrice = 60;
  const totalPerM2 = materialPrice + finishingPrice + optionalFinishingPrice + versoPrice;
  const originalUnitPrice = areaM2 * (totalPerM2 + PRINTING_TYPES.uv.pricePerM2);
  const newUnitPrice = areaM2 * (totalPerM2 + getPrintingPricePerM2("uv", areaM2));

  assert.ok(Math.abs(newUnitPrice - originalUnitPrice - 0.95) < 1e-10);
  assert.equal(areaM2 * getPrintingPricePerM2("uv", areaM2) * 100, 190);
  assert.equal(getMinimumPurchaseForItem("uv", 10, 10), 60);
  assert.equal(getMinimumPurchaseForItem("uv", 1, 1), 60);
});

test("adesivos vinil consideram a margem de corte na area faturada", () => {
  assert.ok(Math.abs(getEffectiveAreaM2(3, 3, "cm", "vinil_branco_fosco", "meio_corte") - 0.001089) < 1e-12);
  assert.ok(Math.abs(getEffectiveAreaM2(3, 3, "cm", "adesivo_perfurado", "sem_acabamento") - 0.001089) < 1e-12);
  assert.ok(Math.abs(getEffectiveAreaM2(3, 3, "cm", "banner_brilho", "sem_acabamento") - 0.0009) < 1e-12);
});

test("manuseio custa por unidade somente para pecas menores que 5x5cm", () => {
  assert.equal(getManuseioPricePerUnit("manuseio", 3, 3), 0.95);
  assert.equal(getManuseioPricePerUnit("manuseio", 3, 5), 0);
  assert.equal(getManuseioPricePerUnit("sem_opcional", 3, 3), 0);
});

test("o piso de R$0,08 por unidade permanece abaixo de 2x2cm", () => {
  assert.equal(getUnitPriceWithSmallPieceMinimum(0.02, 1, 1), 0.08);
  assert.equal(getUnitPriceWithSmallPieceMinimum(0.02, 1.99, 1.99), 0.08);
  assert.equal(getUnitPriceWithSmallPieceMinimum(0.02, 1, 2), 0.02);
  assert.equal(getUnitPriceWithSmallPieceMinimum(0.07, 2, 2), 0.07);
});

test("adesivos eco-solvente recebem 40% ate 25cm2 de area individual sem margem", () => {
  for (const material of ["vinil_branco_fosco", "vinil_branco_brilho", "vinil_transparente_brilho", "adesivo_perfurado"]) {
    for (const [h, w] of [[1, 1], [3, 3], [4, 4], [5, 5], [2.5, 10]]) {
      const pieceAreaM2 = (h / 100) * (w / 100);
      const billedAreaM2 = getEffectiveAreaM2(h, w, "cm", material, "sem_acabamento");
      assert.equal(getSmallPiecePriceMultiplier(material, "eco_solvente", pieceAreaM2, billedAreaM2), 1.4);
    }
  }
});

test("limite de 25cm2 inclui cm, mm e metros e exclui area superior", () => {
  for (const pieceAreaM2 of [5 * 0.01 * (5 * 0.01), 50 * 0.001 * (50 * 0.001), 0.05 * 0.05]) {
    assert.equal(getSmallPiecePriceMultiplier("vinil_branco_fosco", "eco_solvente", pieceAreaM2, 0.002809), 1.4);
  }
  for (const pieceAreaM2 of [5 * 5.001 / 10000, 6 * 6 / 10000, 1]) {
    assert.equal(getSmallPiecePriceMultiplier("vinil_branco_fosco", "eco_solvente", pieceAreaM2, pieceAreaM2), 1);
  }
});

test("UV, banner e adesivos sem impressao preservam o multiplicador anterior", () => {
  for (const [material, printingType] of [
    ["sem_material", "uv"],
    ["banner_brilho", "eco_solvente"],
    ["papel_couche_fosco_150g", "eco_solvente"],
    ["vinil_premium_color", "sem_impressao"],
    ["vinil_branco_fosco", "sem_impressao"],
  ]) {
    assert.equal(getSmallPiecePriceMultiplier(material, printingType, 0.0025, 0.0025), 1);
    assert.equal(getSmallPiecePriceMultiplier(material, printingType, 0.0004, 0.0004), 1.4);
    assert.equal(getSmallPiecePriceMultiplier(material, printingType, 0.0009, 0.0009), 1);
  }
  assert.equal(getPrintingPricePerM2("uv", 0.0025), 190);
});

test("40% aplica uma unica vez aos custos por area sem aumentar manuseio nem piso unitario", () => {
  const billedAreaM2 = getEffectiveAreaM2(3, 3, "cm", "vinil_branco_fosco", "meio_corte");
  const multiplier = getSmallPiecePriceMultiplier("vinil_branco_fosco", "eco_solvente", 0.0009, billedAreaM2);
  const areaCosts = billedAreaM2 * (35 + 60 + 25 + 95);
  const manuseio = getManuseioPricePerUnit("manuseio", 3, 3);
  const unitPrice = areaCosts * multiplier + manuseio;
  assert.ok(Math.abs((unitPrice - manuseio) / areaCosts - 1.4) < 1e-12);
  assert.equal(manuseio, 0.95);
  assert.equal(getUnitPriceWithSmallPieceMinimum(0.02 * multiplier, 1, 1), 0.08);
});
