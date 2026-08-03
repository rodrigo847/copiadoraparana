"use client";

import { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
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

type SampledColor = {
  r: number;
  g: number;
  b: number;
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

function getColorDistance(first: SampledColor, second: SampledColor): number {
  return Math.sqrt(
    (first.r - second.r) ** 2 +
    (first.g - second.g) ** 2 +
    (first.b - second.b) ** 2,
  );
}

function formatRgbColor(color: SampledColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function BackgroundRemovalStudio() {
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [threshold, setThreshold] = useState(235);
  const [tolerance, setTolerance] = useState(42);
  const [feather, setFeather] = useState(25);
  const [vectorCellSize, setVectorCellSize] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadSource, setDownloadSource] = useState<"image" | "vector">("image");
  const [sampledColor, setSampledColor] = useState<SampledColor | null>(null);
  const [sourceImageSize, setSourceImageSize] = useState<{ width: number; height: number } | null>(null);

  const svgPreviewUrlRef = useRef<string | null>(null);
  const sourcePreviewUrlRef = useRef<string | null>(null);
  const sourceSampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const [svgPreviewUrl, setSvgPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sourcePreviewUrlRef.current) {
        URL.revokeObjectURL(sourcePreviewUrlRef.current);
      }

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

    if (sourcePreviewUrlRef.current) {
      URL.revokeObjectURL(sourcePreviewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    sourcePreviewUrlRef.current = objectUrl;

    const image = await loadImage(objectUrl);
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = image.naturalWidth;
    sampleCanvas.height = image.naturalHeight;
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });

    if (sampleContext) {
      sampleContext.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
      sampleContext.drawImage(image, 0, 0);
      sourceSampleCanvasRef.current = sampleCanvas;
    }

    setSourcePreviewUrl(objectUrl);
    setSourceImageSize({ width: image.naturalWidth, height: image.naturalHeight });
    setSampledColor(null);
    setResult(null);
    setErrorMessage(null);
  };

  const handleOriginalImageClick = (event: MouseEvent<HTMLImageElement>) => {
    if (!originalImageRef.current || !sourceImageSize || !sourceSampleCanvasRef.current) {
      return;
    }

    const rect = originalImageRef.current.getBoundingClientRect();
    const imageRatio = sourceImageSize.width / sourceImageSize.height;
    const boxRatio = rect.width / rect.height;

    let renderedWidth = rect.width;
    let renderedHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > boxRatio) {
      renderedHeight = rect.width / imageRatio;
      offsetY = (rect.height - renderedHeight) / 2;
    } else {
      renderedWidth = rect.height * imageRatio;
      offsetX = (rect.width - renderedWidth) / 2;
    }

    const localX = event.clientX - rect.left - offsetX;
    const localY = event.clientY - rect.top - offsetY;

    if (localX < 0 || localY < 0 || localX > renderedWidth || localY > renderedHeight) {
      setErrorMessage("Clique dentro da área útil da imagem para escolher o branco de referência.");
      return;
    }

    const pixelX = clamp(Math.round((localX / renderedWidth) * (sourceImageSize.width - 1)), 0, sourceImageSize.width - 1);
    const pixelY = clamp(Math.round((localY / renderedHeight) * (sourceImageSize.height - 1)), 0, sourceImageSize.height - 1);
    const sampleContext = sourceSampleCanvasRef.current.getContext("2d", { willReadFrequently: true });
    if (!sampleContext) {
      setErrorMessage("Não foi possível capturar a cor da imagem.");
      return;
    }

    const pixelData = sampleContext.getImageData(pixelX, pixelY, 1, 1).data;
    setSampledColor({
      r: pixelData[0],
      g: pixelData[1],
      b: pixelData[2],
    });
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
      const sampledTolerance = clamp(tolerance, 0, 180);
      const smooth = clamp(feather, 0, 120);
      const startFade = edge - smooth;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (sampledColor) {
          const distance = getColorDistance(sampledColor, { r, g, b });

          if (distance <= sampledTolerance) {
            data[i + 3] = 0;
            continue;
          }

          if (smooth > 0 && distance <= sampledTolerance + smooth) {
            const opacity = Math.round(((distance - sampledTolerance) / smooth) * 255);
            data[i + 3] = clamp(opacity, 0, 255);
          }

          continue;
        }

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

  const renderVectorToCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!result) return null;

    const svgBlob = new Blob([result.svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const img = await loadImage(svgUrl);
      const canvas = document.createElement("canvas");
      canvas.width = result.width;
      canvas.height = result.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return canvas;
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  const downloadPng = async () => {
    if (!result) return;

    if (downloadSource === "vector") {
      const vectorCanvas = await renderVectorToCanvas();
      if (!vectorCanvas) return;

      const a = document.createElement("a");
      a.href = vectorCanvas.toDataURL("image/png");
      a.download = "vetor-simplificado.png";
      a.click();
      return;
    }

    const a = document.createElement("a");
    a.href = result.dataUrlPng;
    a.download = "imagem-sem-fundo.png";
    a.click();
  };

  const downloadJpg = async () => {
    if (!result) return;

    const img =
      downloadSource === "vector"
        ? await (async () => {
            const vectorCanvas = await renderVectorToCanvas();
            if (!vectorCanvas) return null;
            return loadImage(vectorCanvas.toDataURL("image/png"));
          })()
        : await loadImage(result.dataUrlPng);

    if (!img) return;

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
    a.download = downloadSource === "vector" ? "vetor-simplificado.jpg" : "imagem-sem-fundo.jpg";
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

    if (downloadSource === "image") {
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

    pdf.save(downloadSource === "vector" ? "vetor-simplificado.pdf" : "imagem-sem-fundo.pdf");
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
              Tolerância da amostra: <strong>{tolerance}</strong>
              <input
                type="range"
                min={0}
                max={180}
                value={tolerance}
                onChange={(event) => setTolerance(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <label className="text-sm font-medium text-[#26415f]">
              Branco automático: <strong>{threshold}</strong>
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
              Fonte para download
              <select
                value={downloadSource}
                onChange={(event) => setDownloadSource(event.target.value as "image" | "vector")}
                className="mt-2 w-full rounded-xl border border-[#cfdcf0] bg-[#f9fbff] px-3 py-2.5 text-sm text-[#193a62]"
              >
                <option value="image">Imagem sem fundo</option>
                <option value="vector">Vetor simplificado</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#d8e4f2] bg-[#f7faff] px-4 py-3 text-sm text-[#355476]">
          <p>
            Clique na prévia <strong>Original</strong> para escolher qual branco deve ser removido.
          </p>
          {sampledColor ? (
            <>
              <span
                className="inline-flex h-7 w-7 rounded-full border border-white shadow-[0_0_0_1px_rgba(19,38,68,0.12)]"
                style={{ backgroundColor: formatRgbColor(sampledColor) }}
                aria-hidden="true"
              />
              <span className="rounded-full bg-white px-3 py-1 font-medium text-[#21466e]">
                Amostra ativa: {formatRgbColor(sampledColor)}
              </span>
              <button
                type="button"
                onClick={() => setSampledColor(null)}
                className="rounded-full border border-[#c9d8ea] bg-white px-3 py-1.5 text-xs font-semibold text-[#2d63a8] transition hover:bg-[#eef5ff]"
              >
                Limpar amostra
              </button>
            </>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 font-medium text-[#21466e]">
              Sem amostra: usando branco automático
            </span>
          )}
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-2xl border border-[#f4d8c5] bg-[#fff7f2] px-3 py-2 text-sm font-medium text-[#b54708]">{errorMessage}</p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#d8e4f2] bg-white p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6380a3]">Original</p>
              <span className="rounded-full bg-[#edf4ff] px-2.5 py-1 text-[11px] font-semibold text-[#2d63a8]">
                Clique para amostrar
              </span>
            </div>
            {sourcePreviewUrl ? (
              <img
                ref={originalImageRef}
                src={sourcePreviewUrl}
                alt="Original"
                onClick={handleOriginalImageClick}
                className="max-h-[360px] w-full cursor-crosshair rounded-xl bg-[rgba(107,114,128,0.6)] object-contain"
              />
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

        <div className="mt-6 flex flex-wrap gap-3">
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

        <p className="mt-2 text-xs text-[#5f7390]">
          Os botões de download seguem a fonte selecionada em <strong>Fonte para download</strong>.
        </p>
      </section>
    </main>
  );
}
