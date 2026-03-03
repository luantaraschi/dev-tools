// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import heic2any from "heic2any";
import { compressImage, formatBytes } from "./utils/compressImage";

const DEFAULTS = {
  mimeType: "image/webp",
  quality: 0.82,
  keepOriginalSize: true,
  lockRatio: true,
  maxWidth: 1920,
  maxHeight: 1920,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function App() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [originalMeta, setOriginalMeta] = useState(null);

  const [settings, setSettings] = useState(DEFAULTS);

  const [result, setResult] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");

  const [comparePos, setComparePos] = useState(0.5);

  const originalSize = file?.size ?? 0;
  const compressedSize = result?.blob?.size ?? 0;

  const changeInfo = useMemo(() => {
    if (!originalSize || !compressedSize) return null;
    const diff = originalSize - compressedSize;
    const pct = (diff / originalSize) * 100;
    return { diff, pct, isSmaller: diff > 0 };
  }, [originalSize, compressedSize]);

  const ratio = useMemo(() => {
    if (!originalMeta?.width || !originalMeta?.height) return null;
    return originalMeta.width / originalMeta.height;
  }, [originalMeta]);

  function cleanupUrl(url) {
    if (url) URL.revokeObjectURL(url);
  }

  function clearAll() {
    setError("");
    setSettings(DEFAULTS);
    setFile(null);
    setOriginalMeta(null);
    cleanupUrl(originalUrl);
    setOriginalUrl(null);
    cleanupUrl(result?.url);
    setResult(null);
    setComparePos(0.5);
  }


  async function readImageMeta(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    });
  }

  async function handlePick(f) {
    setError("");
    if (!f) return;

    const name = (f.name || "").toLowerCase();
    const isHeic =
      f.type === "image/heic" ||
      f.type === "image/heif" ||
      name.endsWith(".heic") ||
      name.endsWith(".heif");

    try {
      cleanupUrl(originalUrl);
      cleanupUrl(result?.url);
      setResult(null);
      setComparePos(0.5);

      if (isHeic) {
        const converted = await heic2any({
          blob: f,
          toType: "image/jpeg",
          quality: 0.92,
        });

        const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
        const convertedFile = new File([jpegBlob], `image.jpg`, { type: "image/jpeg" });

        setFile(convertedFile);
        const url = URL.createObjectURL(convertedFile);
        setOriginalUrl(url);

        const meta = await readImageMeta(url);
        setOriginalMeta(meta);
        return;
      }

      if (!f.type?.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }

      setFile(f);
      const url = URL.createObjectURL(f);
      setOriginalUrl(url);

      const meta = await readImageMeta(url);
      setOriginalMeta(meta);
    } catch (e) {
      setError("Image import failed. Try converting to JPG/PNG.");
    }
  }

  async function handleCompress() {
    if (!file) return;

    setIsWorking(true);
    setError("");

    try {
      const out = await compressImage(file, settings);
      const url = URL.createObjectURL(out.blob);

      cleanupUrl(result?.url);

      setResult({
        blob: out.blob,
        url,
        width: out.width,
        height: out.height,
        mimeType: out.mimeType,
      });

      setComparePos((p) => (result ? p : 0.5));
    } catch (e) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setIsWorking(false);
    }
  }

  function download() {
    if (!result?.blob) return;

    const ext =
      result.mimeType === "image/png"
        ? "png"
        : result.mimeType === "image/jpeg"
        ? "jpg"
        : "webp";

    const a = document.createElement("a");
    a.href = result.url;
    a.download = `image-compressed.${ext}`;
    a.click();
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handlePick(f);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  const qualityDisabled = settings.mimeType === "image/png";

  // Auto re-compress AFTER user already compressed once
  useEffect(() => {
    if (!file || !result) return;

    const t = setTimeout(() => {
      handleCompress();
    }, 350);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.mimeType,
    settings.quality,
    settings.keepOriginalSize,
    settings.maxWidth,
    settings.maxHeight,
    settings.lockRatio,
  ]);

  function setMaxWidthWithRatio(nextW) {
    const w = clamp(Number(nextW || 0), 64, 8000);
    if (!settings.lockRatio || !ratio) {
      setSettings((s) => ({ ...s, maxWidth: w }));
      return;
    }
    const h = clamp(Math.round(w / ratio), 64, 8000);
    setSettings((s) => ({ ...s, maxWidth: w, maxHeight: h }));
  }

  function setMaxHeightWithRatio(nextH) {
    const h = clamp(Number(nextH || 0), 64, 8000);
    if (!settings.lockRatio || !ratio) {
      setSettings((s) => ({ ...s, maxHeight: h }));
      return;
    }
    const w = clamp(Math.round(h * ratio), 64, 8000);
    setSettings((s) => ({ ...s, maxHeight: h, maxWidth: w }));
  }

  const displayedDims = useMemo(() => {
    if (result?.width && result?.height) return `${result.width} × ${result.height}`;
    if (originalMeta?.width && originalMeta?.height) return `${originalMeta.width} × ${originalMeta.height}`;
    return "—";
  }, [result, originalMeta]);

  const savingsText = useMemo(() => {
    if (!changeInfo) return "—";
    const abs = formatBytes(Math.abs(changeInfo.diff));
    const pct = Math.abs(changeInfo.pct).toFixed(1);
    const arrow = changeInfo.isSmaller ? "↓" : "↑";
    return `${abs} (${pct}%) ${arrow}`;
  }, [changeInfo]);

  const beforeText = file ? formatBytes(file.size) : "—";
  const afterText = result ? formatBytes(result.blob.size) : "—";
  const outputText = result ? result.mimeType.replace("image/", "").toUpperCase() : "—";

  return (
    <div className="page">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <h1 className="title">Image Compressor</h1>
            <p className="subtitle">Fast, ad-free image compression.</p>
          </div>

          <div className="actions" />
        </header>

        <main className="grid">
          {/* LEFT */}
          <section className="card cardLeft">
            <div
              className={`drop ${file ? "hasFile" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => inputRef.current?.click()}
              onKeyDown={onKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Upload image"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.heic,.heif"
                className="hidden"
                onChange={(e) => handlePick(e.target.files?.[0])}
              />

              {!file ? (
                <div className="dropInner">
                  <div className="dropTitle">Drop an image</div>
                  <div className="dropHint">or click to browse (HEIC supported)</div>
                </div>
              ) : (
                <div className="fileRowSlim">
                  <div className="fileMeta">
                    <div className="fileNameSlim">Image uploaded</div>
                    <div className="fileSubSlim">
                      {formatBytes(file.size)} · {file.type || "image"}
                    </div>
                  </div>

                  <div className="fileActions">
                    <button className="ghost small" onClick={(e) => (e.stopPropagation(), inputRef.current?.click())}>
                      Change
                    </button>
                    <button
                      className="primary small"
                      onClick={(e) => (e.stopPropagation(), handleCompress())}
                      disabled={!file || isWorking}
                    >
                      {isWorking ? "Compressing…" : "Compress"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="settings">
              <div className="row">
                <label className="label">Format</label>
                <select
                  className="select"
                  value={settings.mimeType}
                  onChange={(e) => setSettings((s) => ({ ...s, mimeType: e.target.value }))}
                >
                  <option value="image/webp">WebP (recommended)</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG (lossless)</option>
                </select>

                {settings.mimeType === "image/png" && (
                  <div className="hint">
                    PNG is lossless — file size may increase. Use Resize to reduce size.
                  </div>
                )}
              </div>

              <div className={`row ${qualityDisabled ? "disabled" : ""}`}>
                <label className="label">
                  Quality <span className="muted">{Math.round(settings.quality * 100)}%</span>
                </label>
                <input
                  className="range"
                  type="range"
                  min="0.4"
                  max="1"
                  step="0.01"
                  value={settings.quality}
                  onChange={(e) => setSettings((s) => ({ ...s, quality: Number(e.target.value) }))}
                  disabled={qualityDisabled}
                />
                {qualityDisabled && <div className="hint">PNG ignores quality.</div>}
              </div>

              <div className="row">
                <label className="label">Resize</label>

                <div className="toggleRow">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.keepOriginalSize}
                      onChange={(e) => setSettings((s) => ({ ...s, keepOriginalSize: e.target.checked }))}
                    />
                    <span>Keep original dimensions</span>
                  </label>

                  {!settings.keepOriginalSize && (
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.lockRatio}
                        onChange={(e) => setSettings((s) => ({ ...s, lockRatio: e.target.checked }))}
                        disabled={!ratio}
                      />
                      <span>Lock ratio</span>
                    </label>
                  )}
                </div>
              </div>

              {!settings.keepOriginalSize && (
                <div className="row two">
                  <div>
                    <label className="label">Max width</label>
                    <input
                      className="input"
                      type="number"
                      min="64"
                      max="8000"
                      value={settings.maxWidth}
                      onChange={(e) => setMaxWidthWithRatio(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Max height</label>
                    <input
                      className="input"
                      type="number"
                      min="64"
                      max="8000"
                      value={settings.maxHeight}
                      onChange={(e) => setMaxHeightWithRatio(e.target.value)}
                    />
                  </div>
                  <div className="hint span2">Downscale only. It won’t upscale smaller images.</div>
                </div>
              )}

              {error && <div className="error">{error}</div>}
            </div>

            {/* STATS: 5 cards + 6th note card (compact) */}
            <div className="miniStats">
              <div className="miniStat">
                <div className="miniLabel">Before</div>
                <div className="miniValue">{beforeText}</div>
              </div>

              <div className="miniStat">
                <div className="miniLabel">After</div>
                <div className="miniValue">{afterText}</div>
              </div>

              <div className="miniStat">
                <div className="miniLabel">Dimensions</div>
                <div className="miniValue">{displayedDims}</div>
              </div>

              <div className="miniStat">
                <div className="miniLabel">Output</div>
                <div className="miniValue">{outputText}</div>
              </div>

              <div className="miniStat">
                <div className="miniLabel">Savings</div>
                <div className="miniValue">{savingsText}</div>
              </div>

              <div className="miniStat note">Fast. Minimal. Built for quick results.</div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="card cardRight">
            <div className="previewHeader">
              <div className="sectionTitle">Preview</div>
              <div className="previewActions">
                <button
                  className="ghost clearBtn"
                  onClick={clearAll}
                  disabled={!file && !originalUrl && !result}
                >
                  Clear
                </button>

                <button className="primaryLight" onClick={download} disabled={!result}>
                  Download
                </button>
              </div>
            </div>

            <div className="compareFrame">
              {!originalUrl ? (
                <div className="empty">No image</div>
              ) : (
                <div className="compareCanvas">
                  <img className="compareImg" src={originalUrl} alt="Original" />

                  {result?.url && (
                    <img
                      className="compareImg top"
                      src={result.url}
                      alt="Compressed"
                      style={{
                        clipPath: `inset(0 ${Math.round((1 - comparePos) * 100)}% 0 0)`,
                      }}
                    />
                  )}

                  {result?.url && (
                    <>
                      <div className="compareLine" style={{ left: `${Math.round(comparePos * 100)}%` }} />
                      <div className="compareKnob" style={{ left: `${Math.round(comparePos * 100)}%` }} />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Slider always visible */}
            <div className={`compareSliderRow ${!result ? "disabled" : ""}`}>
              <span className="compareLabel">Before</span>
              <input
                className="range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={comparePos}
                onChange={(e) => setComparePos(Number(e.target.value))}
                disabled={!result}
                aria-label="Compare slider"
              />
              <span className="compareLabel">After</span>
            </div>
          </section>
        </main>

        <footer className="credit">
          <a className="creditLink" href="https://instagram.com/berkindev" target="_blank" rel="noreferrer">
            Coded by @berkindev
          </a>
        </footer>
      </div>
    </div>
  );
}