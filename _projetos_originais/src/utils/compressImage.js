export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

async function loadBitmap(fileOrBlob) {
  // createImageBitmap is faster when available
  if ("createImageBitmap" in window) {
    return await createImageBitmap(fileOrBlob);
  }
  // fallback
  const url = URL.createObjectURL(fileOrBlob);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function calcTargetSize(origW, origH, maxW, maxH) {
  const scale = Math.min(maxW / origW, maxH / origH, 1); // downscale only
  return {
    w: Math.max(1, Math.round(origW * scale)),
    h: Math.max(1, Math.round(origH * scale)),
  };
}

export async function compressImage(file, settings) {
  const { mimeType, quality, keepOriginalSize, maxWidth, maxHeight } = settings;

  const bitmap = await loadBitmap(file);
  const origW = bitmap.width;
  const origH = bitmap.height;

  const target = keepOriginalSize
    ? { w: origW, h: origH }
    : calcTargetSize(origW, origH, maxWidth, maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = target.w;
  canvas.height = target.h;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas not supported.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.clearRect(0, 0, target.w, target.h);
  ctx.drawImage(bitmap, 0, 0, target.w, target.h);

  const outMime = mimeType || "image/webp";

  const blob = await new Promise((resolve) => {
    const q = outMime === "image/png" ? undefined : quality;
    canvas.toBlob((b) => resolve(b), outMime, q);
  });

  if (!blob) throw new Error("Compression failed.");

  return {
    blob,
    width: target.w,
    height: target.h,
    mimeType: outMime,
  };
}