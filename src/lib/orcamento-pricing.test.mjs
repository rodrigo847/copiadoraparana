import assert from "node:assert/strict";
import test from "node:test";
import {
  getEffectiveAreaM2,
  getManuseioPricePerUnit,
  getMinimumPurchaseForItem,
  getPrintingPricePerM2,
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
