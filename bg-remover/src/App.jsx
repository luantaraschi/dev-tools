import { useState } from "react";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function removeBackground() {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image_file", file);

    const res = await fetch("/api/remove-bg", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    setResult(URL.createObjectURL(blob));
    setLoading(false);
  }

  return (
    <div className="app">
      <header className="topbar">Background Remover</header>

      <main className="stage">
        <section className="hero">
          <h1>Remove image backgrounds.</h1>
          <p>Instant, clean PNGs. No signup. No noise.</p>

          <label className="dropzone">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files[0];
                setFile(f);
                setOriginal(URL.createObjectURL(f));
                setResult(null);
              }}
            />
            {!file ? "Upload an image" : "✓ Image ready"}
          </label>

          <button onClick={removeBackground} disabled={loading}>
            {loading ? "Processing…" : "Remove Background"}
          </button>

          {result && (
            <div className="compare">
              <div>
                <small>Original</small>
                <img src={original} />
              </div>
              <div>
                <small>Result</small>
                <img src={result} />
              </div>

              <a
                className="download"
                href={result}
                download="background-removed.png"
              >
                Download PNG
              </a>
            </div>
          )}
        </section>
      </main>

      <footer className="credit">
        Crafted by{" "}
        <a
          href="https://instagram.com/berkindev"
          target="_blank"
          rel="noreferrer"
        >
          @berkindev
        </a>
      </footer>
    </div>
  );
}