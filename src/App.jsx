import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import CardLayout from "./components/CardLayout";
import QRForm from "./components/QRForm";
import QRPreview from "./components/QRPreview";
import QRExport from "./components/QRExport";
import QRHistory from "./components/QRHistory";

/**
 * App:
 * - Uses a lazy initializer to load history from localStorage once (race-free).
 * - Persists history on change with try/catch and a quota-safe fallback.
 * - Shows toasts on save/delete; asks confirmation before delete (handled in QRHistory).
 */
export default function App() {
  const STORAGE_KEY = "qr_history_v1";

  // Lazy initializer — read once, synchronously; avoids effect races.
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");
  const [format, setFormat] = useState("canvas"); // 'canvas' | 'svg'
  const [size, setSize] = useState(200);
  const [fileName, setFileName] = useState("qr-code");

  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Persist history whenever it changes (with quota guard).
  useEffect(() => {
    const save = (data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };
    try {
      save(history);
    } catch (e) {
      // If localStorage quota is exceeded (very large PNGs/SVGs),
      // trim older items and try again instead of failing silently.
      if (
        e &&
        typeof e === "object" &&
        "name" in e &&
        e.name === "QuotaExceededError"
      ) {
        // Keep newest 70% and retry
        const trimmed = history.slice(0, Math.ceil(history.length * 0.7));
        try {
          save(trimmed);
          setHistory(trimmed);
          triggerToast("Storage full: trimmed older history items.");
        } catch {
          // If still failing, keep only the latest one
          const minimal = history.slice(0, 1);
          try {
            save(minimal);
            setHistory(minimal);
            triggerToast("Storage very full: kept latest item only.");
          } catch {
            // As a last resort, clear
            localStorage.removeItem(STORAGE_KEY);
            setHistory([]);
            triggerToast(
              "Could not persist history (storage disabled or full)."
            );
          }
        }
      }
    }
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
      id:
        crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      text,
      fileName: sanitizeFileName(fileName),
      format,
      size,
      previewUrl,
      savedAt: new Date().toISOString(),
    };

    setHistory((prev) => [entry, ...prev]);
    triggerToast("Saved to history!");
  };

  const handleDeleteHistory = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    triggerToast("Deleted from history.");
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  // Derived memo for total count (example of best-practice memoization)
  const historyCount = useMemo(() => history.length, [history]);

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
            <CardLayout title={`History (${historyCount})`}>
              <QRHistory items={history} onDelete={handleDeleteHistory} />
            </CardLayout>
          </Col>
        </Row>
      </Container>

      {/* Toast notifications */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="dark"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
