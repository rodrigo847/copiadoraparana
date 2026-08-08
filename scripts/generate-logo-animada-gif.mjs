import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import sharp from "sharp";
import gifenc from "gifenc";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const logoPath = path.join(rootDir, "public", "img", "logo.png");
const outputPath = path.join(rootDir, "public", "img", "logo-animada.gif");

const phraseA = "Copiadora";
const phraseB = "Comunica\u00e7\u00e3o Visual";

const frameDelay = 14;
const typeHoldFrames = 14;
const emptyHoldFrames = 8;
const typeStepFrames = 3;
const eraseStepFrames = 2;

function repeatPush(target, value, count) {
  for (let i = 0; i < count; i += 1) {
    target.push(value);
  }
}

function buildPhraseFrames(phrase) {
  const frames = [];

  repeatPush(frames, "", emptyHoldFrames);

  for (let i = 1; i <= phrase.length; i += 1) {
    repeatPush(frames, phrase.slice(0, i), typeStepFrames);
  }

  repeatPush(frames, phrase, typeHoldFrames);

  for (let i = phrase.length - 1; i >= 0; i -= 1) {
    repeatPush(frames, phrase.slice(0, i), eraseStepFrames);
  }

  repeatPush(frames, "", emptyHoldFrames);

  return frames;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

async function createTypingGif() {
  const resizedLogo = sharp(logoPath).resize({
    height: 78,
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  });

  const logoBuffer = await resizedLogo.png().toBuffer();
  const logoMeta = await sharp(logoBuffer).metadata();

  if (!logoMeta.width || !logoMeta.height) {
    throw new Error("Nao foi possivel ler as dimensoes da logo.");
  }

  const paddingX = 20;
  const paddingY = 10;
  const textGap = 20;
  const textAreaWidth = 460;

  const frameWidth = paddingX + logoMeta.width + textGap + textAreaWidth + paddingX;
  const frameHeight = Math.max(logoMeta.height + paddingY * 2, 98);

  const logoTop = Math.round((frameHeight - logoMeta.height) / 2);
  const logoLeft = paddingX;
  const textLeft = logoLeft + logoMeta.width + textGap;
  const textBaseline = Math.round(frameHeight / 2) + 14;

  const sequence = [
    ...buildPhraseFrames(phraseA),
    ...buildPhraseFrames(phraseB),
  ];

  const rawFrames = [];

  const background = { r: 7, g: 31, b: 60, alpha: 1 };

  for (const text of sequence) {
    const textSvg = `
      <svg width="${frameWidth}" height="${frameHeight}" viewBox="0 0 ${frameWidth} ${frameHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .brand {
            font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
            font-size: 44px;
            font-weight: 600;
            fill: #f6fbff;
            letter-spacing: 0.6px;
          }
        </style>
        <text class="brand" x="${textLeft}" y="${textBaseline}">${escapeXml(text)}</text>
      </svg>
    `;

    const frame = await sharp({
      create: {
        width: frameWidth,
        height: frameHeight,
        channels: 4,
        background,
      },
    })
      .composite([
        { input: logoBuffer, left: logoLeft, top: logoTop },
        { input: Buffer.from(textSvg), left: 0, top: 0 },
      ])
      .raw()
      .toBuffer();

    rawFrames.push(frame);
  }

  const gif = GIFEncoder();
  const frameSize = frameWidth * frameHeight * 4;
  const allPixels = new Uint8Array(frameSize * rawFrames.length);

  rawFrames.forEach((frame, index) => {
    allPixels.set(frame, index * frameSize);
  });

  const globalPalette = quantize(allPixels, 256);

  for (const rgbaFrame of rawFrames) {
    const index = applyPalette(rgbaFrame, globalPalette);

    gif.writeFrame(index, frameWidth, frameHeight, {
      palette: globalPalette,
      delay: frameDelay,
      transparent: false,
      dispose: 2,
    });
  }

  gif.finish();
  await fs.writeFile(outputPath, Buffer.from(gif.bytes()));

  console.log(`GIF criado em: ${outputPath}`);
  console.log(`Frames: ${rawFrames.length} | Delay por frame: ${frameDelay / 100}s`);
}

createTypingGif().catch((error) => {
  console.error(error);
  process.exit(1);
});
