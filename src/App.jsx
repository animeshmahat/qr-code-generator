import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import CardLayout from "./components/CardLayout";
import QRForm from "./components/QRForm";
import QRPreview from "./components/QRPreview";
import QRExport from "./components/QRExport";
import QRHistory from "./components/QRHistory";

/**
 * App component:
 * - Holds global state (text, format, size, filename, history).
 * - Side-by-side on wide screens; stacked on small screens.
 * - History is persisted in localStorage.
 */
export default function App() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState("canvas"); // 'canvas' | 'svg'
  const [size, setSize] = useState(200); // px
  const [fileName, setFileName] = useState("qr-code");
  const [history, setHistory] = useState([]);

  // Load history initially
  useEffect(() => {
    const saved = localStorage.getItem("qr_history_v1");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // if corrupted, ignore
      }
    }
  }, []);

  // Persist history whenever it changes
  useEffect(() => {
    localStorage.setItem("qr_history_v1", JSON.stringify(history));
  }, [history]);

  // Helper: sanitize filenames (letters/numbers/-/_)
  const sanitizeFileName = (name) =>
    (name || "")
      .trim()
      .replace(/[^a-z0-9-_]/gi, "_")
      .replace(/_+/g, "_") || "qr-code";

  // Save current QR to history (stores a preview data URL + meta)
  const handleSaveToHistory = () => {
    if (!text) return;

    // Get a preview image data URL for the current QR
    let previewUrl = "";
    if (format === "canvas") {
      const canvas = document.getElementById("qr-canvas");
      if (!canvas) return alert("QR canvas not found.");
      previewUrl = canvas.toDataURL("image/png");
    } else {
      const svg = document.getElementById("qr-svg");
      if (!svg) return alert("QR SVG not found.");
      const xml = new XMLSerializer().serializeToString(svg);
      previewUrl =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    }

    const entry = {
      id: crypto.randomUUID(),
      text,
      fileName: sanitizeFileName(fileName),
      format,
      size,
      previewUrl,
      savedAt: new Date().toISOString(),
    };

    setHistory((prev) => [entry, ...prev]);
  };

  const handleDeleteHistory = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Row className="justify-content-center align-items-start">
          {/* Left: Controls */}
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <CardLayout title="Enter Your Details">
              <QRForm
                text={text}
                onTextChange={setText}
                format={format}
                onFormatChange={setFormat}
                size={size}
                onSizeChange={setSize}
              />
            </CardLayout>
          </Col>

          {/* Right: Preview + Export */}
          <Col xs={12} md={6}>
            <CardLayout title="Your QR Code">
              <QRPreview text={text} format={format} size={size} />
              <QRExport
                text={text}
                format={format}
                fileName={fileName}
                onFileNameChange={setFileName}
                sanitizeFileName={sanitizeFileName}
                onSaveToHistory={handleSaveToHistory}
              />
            </CardLayout>
          </Col>
        </Row>

        {/* History row */}
        <Row className="mt-4">
          <Col xs={12}>
            <CardLayout title="History">
              <QRHistory
                items={history}
                onDelete={handleDeleteHistory}
                // Reuse same sanitize + download logic inside list
              />
            </CardLayout>
          </Col>
        </Row>
      </Container>
    </>
  );
}
