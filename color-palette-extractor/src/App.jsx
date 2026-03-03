import { useRef, useState } from "react";
import { extractColors } from "./utils/extractColors";

export default function App() {
  const inputRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [colors, setColors] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");
  const [colorCount, setColorCount] = useState(6);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [colorFormat, setColorFormat] = useState("hex");

  function cleanupUrl(url) {
    if (url) URL.revokeObjectURL(url);
  }

  function clearAll() {
    setError("");
    cleanupUrl(imageUrl);
    setImageUrl(null);
    setColors([]);
    setCopiedIndex(null);
  }

  async function handlePick(f) {
    setError("");
    if (!f) return;

    if (!f.type?.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    cleanupUrl(imageUrl);
    setColors([]);
    setCopiedIndex(null);

    const url = URL.createObjectURL(f);
    setImageUrl(url);

    await extractPalette(url);
  }

  async function extractPalette(url) {
    setIsExtracting(true);
    setError("");

    try {
      const extracted = await extractColors(url, colorCount);
      setColors(extracted);
    } catch (e) {
      setError(e?.message || "Failed to extract colors.");
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleReextract() {
    if (!imageUrl) return;
    await extractPalette(imageUrl);
  }

  function getColorValue(color) {
    switch (colorFormat) {
      case "rgb":
        return color.rgb;
      case "hsl":
        return color.hslString;
      default:
        return color.hex.toUpperCase();
    }
  }

  async function copyColor(color, index) {
    const value = getColorValue(color);
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setError("Failed to copy to clipboard.");
    }
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

  return (
    <div className="page">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <h1 className="title">Color Palette Extractor</h1>
            <p className="subtitle">Extract beautiful color palettes from any image.</p>
          </div>
        </header>

        <main className="grid">
          {/* LEFT - Image Upload & Settings */}
          <section className="card cardLeft">
            <div
              className={`drop ${imageUrl ? "hasFile" : ""}`}
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
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePick(e.target.files?.[0])}
              />

              {!imageUrl ? (
                <div className="dropInner">
                  <div className="dropIcon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <div className="dropTitle">Drop an image</div>
                  <div className="dropHint">or click to browse</div>
                </div>
              ) : (
                <div className="previewThumb">
                  <img src={imageUrl} alt="Uploaded" className="thumbImg" />
                  <div className="thumbOverlay">
                    <button
                      className="ghost small"
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="settings">
              <div className="row">
                <label className="label">
                  Number of colors <span className="muted">{colorCount}</span>
                </label>
                <input
                  className="range"
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={colorCount}
                  onChange={(e) => setColorCount(Number(e.target.value))}
                />
              </div>

              <div className="row">
                <label className="label">Color format</label>
                <div className="formatToggle">
                  <button
                    className={`formatBtn ${colorFormat === "hex" ? "active" : ""}`}
                    onClick={() => setColorFormat("hex")}
                  >
                    HEX
                  </button>
                  <button
                    className={`formatBtn ${colorFormat === "rgb" ? "active" : ""}`}
                    onClick={() => setColorFormat("rgb")}
                  >
                    RGB
                  </button>
                  <button
                    className={`formatBtn ${colorFormat === "hsl" ? "active" : ""}`}
                    onClick={() => setColorFormat("hsl")}
                  >
                    HSL
                  </button>
                </div>
              </div>

              <button
                className="primary extractBtn"
                onClick={handleReextract}
                disabled={!imageUrl || isExtracting}
              >
                {isExtracting ? "Extracting..." : "Re-extract Colors"}
              </button>

              {error && <div className="error">{error}</div>}
            </div>

            <div className="infoCard">
              Click any color to copy its value to clipboard.
            </div>
          </section>

          {/* RIGHT - Color Palette */}
          <section className="card cardRight">
            <div className="paletteHeader">
              <div className="sectionTitle">Palette</div>
              <button
                className="ghost clearBtn"
                onClick={clearAll}
                disabled={!imageUrl && colors.length === 0}
              >
                Clear
              </button>
            </div>

            <div className="paletteArea">
              {colors.length === 0 ? (
                <div className="empty">
                  {isExtracting ? "Extracting colors..." : "Upload an image to extract colors"}
                </div>
              ) : (
                <div className="colorGrid">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className="colorCard"
                      style={{
                        backgroundColor: color.hex,
                        color: color.contrast,
                      }}
                      onClick={() => copyColor(color, index)}
                      aria-label={`Copy ${getColorValue(color)}`}
                    >
                      <div className="colorValue">
                        {copiedIndex === index ? "Copied!" : getColorValue(color)}
                      </div>
                      <div className="colorMeta" style={{ opacity: 0.7 }}>
                        {colorFormat === "hex" && `RGB(${color.r}, ${color.g}, ${color.b})`}
                        {colorFormat === "rgb" && color.hex.toUpperCase()}
                        {colorFormat === "hsl" && color.hex.toUpperCase()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {colors.length > 0 && (
              <div className="paletteStrip">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="stripColor"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="credit">
          <a
            className="creditLink"
            href="https://instagram.com/berkindev"
            target="_blank"
            rel="noreferrer"
          >
            Coded by @berkindev
          </a>
        </footer>
      </div>
    </div>
  );
}
