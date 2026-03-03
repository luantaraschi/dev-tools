import { useState } from "react";
import heic2any from "heic2any";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [loading, setLoading] = useState(false);

  async function convert() {
    if (!file) return;

    setLoading(true);
    setOutput(null);

    let source = file;

    // HEIC / HEIF sadece INPUT olarak desteklenir
    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      source = await heic2any({ blob: file, toType: format });
    }

    const img = new Image();
    img.src = URL.createObjectURL(source);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      // JPG için beyaz arka plan
      if (format === "image/jpeg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          setOutput(URL.createObjectURL(blob));
          setLoading(false);
        },
        format,
        0.95
      );
    };
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setOutput(null);
    }
  }

  return (
    <div className="wrapper">
      <main
        className="card"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h1>Image Converter</h1>

        <p className="subtitle">
          Convert JPG, PNG, WEBP. HEIC supported as input.
        </p>

        <label className="file">
          <input
            type="file"
            accept="image/*,.heic,.HEIC,.heif,.HEIF"
            hidden
            onChange={(e) => {
              setFile(e.target.files[0]);
              setOutput(null);
            }}
          />
          {file ? "✓ Image selected" : "Click to choose or drop HEIC"}
        </label>

        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPG</option>
          <option value="image/webp">WEBP</option>
        </select>

        <button onClick={convert} disabled={!file || loading}>
          {!file
            ? "Select an image"
            : loading
            ? "Converting…"
            : "Convert"}
        </button>

        {output && (
          <a
            className="download"
            href={output}
            download={`converted.${format.split("/")[1]}`}
          >
            Download image
          </a>
        )}
      </main>

      {/* EN ALT */}
      <div className="credits-bottom">
        Coded by{" "}
        <a
          href="https://instagram.com/berkindev"
          target="_blank"
          rel="noreferrer"
        >
          @berkindev
        </a>
      </div>
    </div>
  );
}