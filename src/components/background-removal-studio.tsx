"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";

type VectorCell = {
  x: number;
  y: number;
  size: number;
  r: number;
  g: number;
  b: number;
};

type ProcessResult = {
  dataUrlPng: string;
  width: number;
  height: number;
  cells: VectorCell[];
  svgMarkup: string;
};

const MAX_IMAGE_SIDE = 1600;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem."));
    img.src = src;
  });
}

function createVectorCellsFromImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  cellSize: number,
): VectorCell[] {
  const cells: VectorCell[] = [];

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sumA = 0;
      let count = 0;

      const yEnd = Math.min(y + cellSize, height);
      const xEnd = Math.min(x + cellSize, width);

      for (let py = y; py < yEnd; py += 1) {
        for (let px = x; px < xEnd; px += 1) {
          const i = (py * width + px) * 4;
          const alpha = data[i + 3];
          if (alpha < 20) continue;

          sumR += data[i];
          sumG += data[i + 1];
          sumB += data[i + 2];
          sumA += alpha;
          count += 1;
        }
      }

      if (count === 0) continue;

      const opacityRatio = sumA / (count * 255);
      if (opacityRatio < 0.2) continue;

      cells.push({
        x,
        y,
        size: cellSize,
        r: Math.round(sumR / count),
        g: Math.round(sumG / count),
        b: Math.round(sumB / count),
      });
    }
  }

  return cells;
}

function buildSvgMarkup(width: number, height: number, cells: VectorCell[]): string {
  const rects = cells
    .map(
      (cell) =>
        `<rect x="${cell.x}" y="${cell.y}" width="${cell.size}" height="${cell.size}" fill="rgb(${cell.r},${cell.g},${cell.b})" />`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="transparent"/>${rects}</svg>`;
}

export function BackgroundRemovalStudio() {
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [threshold, setThreshold] = useState(235);
  const [feather, setFeather] = useState(25);
  const [vectorCellSize, setVectorCellSize] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfMode, setPdfMode] = useState<"raster" | "vector">("vector");

  const svgPreviewUrlRef = useRef<string | null>(null);
  const [svgPreviewUrl, setSvgPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (svgPreviewUrlRef.current) {
        URL.revokeObjectURL(svgPreviewUrlRef.current);
      }
    };
  }, []);

  const hasResult = Boolean(result?.dataUrlPng);

  const itemCountLabel = useMemo(() => {
    if (!result) return "Sem vetor gerado";
    return `${result.cells.length.toLocaleString("pt-BR")} blocos vetoriais`;
  }, [result]);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSourcePreviewUrl(objectUrl);
    setResult(null);
    setErrorMessage(null);
  };

  const processImage = async () => {
    if (!sourcePreviewUrl) {
      setErrorMessage("Selecione uma imagem primeiro.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const image = await loadImage(sourcePreviewUrl);

      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        throw new Error("Não foi possível processar a imagem.");
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const edge = clamp(threshold, 150, 255);
      const smooth = clamp(feather, 0, 120);
      const startFade = edge - smooth;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const minRgb = Math.min(r, g, b);

        if (minRgb >= edge) {
          data[i + 3] = 0;
          continue;
        }

        if (smooth > 0 && minRgb > startFade) {
          const opacity = Math.round(((edge - minRgb) / smooth) * 255);
          data[i + 3] = clamp(opacity, 0, 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const cells = createVectorCellsFromImageData(data, width, height, clamp(vectorCellSize, 4, 24));
      const svgMarkup = buildSvgMarkup(width, height, cells);
      const dataUrlPng = canvas.toDataURL("image/png");

      if (svgPreviewUrlRef.current) {
        URL.revokeObjectURL(svgPreviewUrlRef.current);
      }

      const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      svgPreviewUrlRef.current = svgUrl;
      setSvgPreviewUrl(svgUrl);

      setResult({
        dataUrlPng,
        width,
        height,
        cells,
        svgMarkup,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao processar imagem.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPng = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.dataUrlPng;
    a.download = "imagem-sem-fundo.png";
    a.click();
  };

  const downloadJpg = async () => {
    if (!result) return;
    const img = await loadImage(result.dataUrlPng);

    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.download = "imagem-sem-fundo.jpg";
    a.click();
  };

  const downloadPdf = async () => {
    if (!result) return;

    const orientation = result.width >= result.height ? "landscape" : "portrait";
    const pdf = new jsPDF({ orientation, unit: "pt", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const drawWidth = pageWidth - margin * 2;
    const drawHeight = pageHeight - margin * 2;

    const ratio = Math.min(drawWidth / result.width, drawHeight / result.height);
    const targetWidth = result.width * ratio;
    const targetHeight = result.height * ratio;
    const x = (pageWidth - targetWidth) / 2;
    const y = (pageHeight - targetHeight) / 2;

    if (pdfMode === "raster") {
      const img = await loadImage(result.dataUrlPng);
      const canvas = document.createElement("canvas");
      canvas.width = result.width;
      canvas.height = result.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.95);

      pdf.addImage(jpgDataUrl, "JPEG", x, y, targetWidth, targetHeight);
    } else {
      const scale = ratio;
      result.cells.forEach((cell) => {
        pdf.setFillColor(cell.r, cell.g, cell.b);
        pdf.rect(x + cell.x * scale, y + cell.y * scale, cell.size * scale, cell.size * scale, "F");
      });
    }

    pdf.save("imagem-processada.pdf");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e8edf4_0%,#dfe8f2_100%)] px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-[#c9d8ea] bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] p-5 shadow-[0_20px_48px_rgba(19,38,68,0.12)] sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2d63a8]">Área interna do operador</p>
          <h1 className="font-heading text-3xl font-bold text-[#123355]">Remover fundo branco e gerar vetor simplificado</h1>
          <p className="max-w-3xl text-sm text-[#4f6988] sm:text-base">
            Ferramenta enxuta para produção rápida: upload, recorte de fundo branco, versão vetorizada simplificada e download em PNG, JPG e PDF.
          </p>
        </div>

        <div className="grid gap-5 rounded-2xl border border-[#d8e4f2] bg-white p-4 sm:grid-cols-2 sm:p-5">
          <label className="text-sm font-semibold text-[#26415f]">
            Imagem
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="mt-2 block w-full rounded-xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#26415f]">
              Limiar do branco: <strong>{threshold}</strong>
              <input
                type="range"
                min={180}
                max={255}
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <label className="text-sm font-medium text-[#26415f]">
              Suavização: <strong>{feather}</strong>
              <input
                type="range"
                min={0}
                max={80}
                value={feather}
                onChange={(event) => setFeather(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <label className="text-sm font-medium text-[#26415f]">
              Bloco vetorial: <strong>{vectorCellSize}px</strong>
              <input
                type="range"
                min={4}
                max={24}
                value={vectorCellSize}
                onChange={(event) => setVectorCellSize(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <label className="text-sm font-medium text-[#26415f]">
              Modo PDF
              <select
                value={pdfMode}
                onChange={(event) => setPdfMode(event.target.value as "raster" | "vector")}
                className="mt-2 w-full rounded-xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62]"
              >
                <option value="vector">Vetorial simplificado</option>
                <option value="raster">Raster (fiel à imagem)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={processImage}
            disabled={isProcessing || !sourcePreviewUrl}
            className="rounded-full bg-[#79a2e3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#668fd3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Processando..." : "Remover fundo e vetorizar"}
          </button>

          <button
            type="button"
            onClick={downloadPng}
            disabled={!hasResult}
            className="rounded-full border border-[#c9d8ea] bg-white px-5 py-2.5 text-sm font-semibold text-[#2d63a8] transition hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Baixar PNG
          </button>

          <button
            type="button"
            onClick={downloadJpg}
            disabled={!hasResult}
            className="rounded-full border border-[#c9d8ea] bg-white px-5 py-2.5 text-sm font-semibold text-[#2d63a8] transition hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Baixar JPG
          </button>

          <button
            type="button"
            onClick={downloadPdf}
            disabled={!hasResult}
            className="rounded-full border border-[#c9d8ea] bg-white px-5 py-2.5 text-sm font-semibold text-[#2d63a8] transition hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Baixar PDF
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-2xl border border-[#f4d8c5] bg-[#fff7f2] px-3 py-2 text-sm font-medium text-[#b54708]">{errorMessage}</p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#d8e4f2] bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Original</p>
            {sourcePreviewUrl ? (
              <img src={sourcePreviewUrl} alt="Original" className="max-h-[360px] w-full rounded-xl bg-[rgba(107,114,128,0.6)] object-contain" />
            ) : (
              <div className="flex h-[260px] items-center justify-center rounded-xl bg-[rgba(107,114,128,0.6)] text-sm text-white/90">Aguardando imagem</div>
            )}
          </div>

          <div className="rounded-2xl border border-[#d8e4f2] bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Sem fundo (PNG)</p>
            {result ? (
              <img src={result.dataUrlPng} alt="Sem fundo" className="max-h-[360px] w-full rounded-xl bg-[rgba(107,114,128,0.6)] object-contain" />
            ) : (
              <div className="flex h-[260px] items-center justify-center rounded-xl bg-[rgba(107,114,128,0.6)] text-sm text-white/90">Processamento pendente</div>
            )}
          </div>

          <div className="rounded-2xl border border-[#d8e4f2] bg-white p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Vetor simplificado</p>
              <span className="rounded-full bg-[#edf4ff] px-2.5 py-1 text-[11px] font-semibold text-[#2d63a8]">{itemCountLabel}</span>
            </div>

            {svgPreviewUrl ? (
              <img src={svgPreviewUrl} alt="Vetor simplificado" className="max-h-[360px] w-full rounded-xl bg-[rgba(107,114,128,0.6)] object-contain" />
            ) : (
              <div className="flex h-[260px] items-center justify-center rounded-xl bg-[rgba(107,114,128,0.6)] text-sm text-white/90">Sem vetor gerado</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
