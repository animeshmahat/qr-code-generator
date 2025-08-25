import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  ToastContainer,
  Toast,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import CardLayout from "./components/CardLayout";
import QRForm from "./components/QRForm";
import QRPreview from "./components/QRPreview";
import QRExport from "./components/QRExport";
import QRHistory from "./components/QRHistory";
import BusinessCard from "./components/BusinessCard";

/**
 * App:
 * - Adds a toggle between "QR Only" and "Business Card".
 * - Manages localStorage-persisted history.
 * - Provides toast feedback.
 */
export default function App() {
  const STORAGE_KEY = "qr_history_v1";

  // Read history once at init; avoids effect races
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // QR config
  const [text, setText] = useState("");
  const [format, setFormat] = useState("canvas"); // 'canvas' | 'svg'
  const [size, setSize] = useState(200);
  const [fileName, setFileName] = useState("qr-code");

  // Business card fields
  const [cardData, setCardData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    website: "",
  });

  // Mode: "qr" | "card"
  const [mode, setMode] = useState("qr");

  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Persist history whenever it changes (with quota guard)
  useEffect(() => {
    const save = (data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };
    try {
      save(history);
    } catch (e) {
      if (
        e &&
        typeof e === "object" &&
        "name" in e &&
        e.name === "QuotaExceededError"
      ) {
        const trimmed = history.slice(0, Math.ceil(history.length * 0.7));
        try {
          save(trimmed);
          setHistory(trimmed);
          triggerToast("Storage full: trimmed older history items.");
        } catch {
          const minimal = history.slice(0, 1);
          try {
            save(minimal);
            setHistory(minimal);
            triggerToast("Storage very full: kept latest item only.");
          } catch {
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
      cardData,
      mode,
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

  const historyCount = useMemo(() => history.length, [history]);

  return (
    <>
      <AppNavbar />
      <Container>
        <Row className="justify-content-center align-items-start">
          {/* Left: Controls */}
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <CardLayout title="Enter Your Details">
              {/* Mode toggle */}
              <div className="text-center mb-3">
                <ButtonGroup>
                  <Button
                    variant={mode === "qr" ? "primary" : "outline-primary"}
                    onClick={() => setMode("qr")}
                  >
                    QR Only
                  </Button>
                  <Button
                    variant={mode === "card" ? "primary" : "outline-primary"}
                    onClick={() => setMode("card")}
                  >
                    Business Card
                  </Button>
                </ButtonGroup>
              </div>

              <QRForm
                text={text}
                onTextChange={setText}
                format={format}
                onFormatChange={setFormat}
                size={size}
                onSizeChange={setSize}
                cardData={cardData}
                onCardDataChange={setCardData}
              />
            </CardLayout>
          </Col>

          {/* Right: Preview */}
          <Col xs={12} md={6}>
            <CardLayout title="Preview">
              {mode === "qr" ? (
                <>
                  <QRPreview text={text} format={format} size={size} />
                  <QRExport
                    text={text}
                    format={format}
                    fileName={fileName}
                    onFileNameChange={setFileName}
                    sanitizeFileName={sanitizeFileName}
                    onSaveToHistory={handleSaveToHistory}
                  />
                </>
              ) : (
                <BusinessCard
                  cardData={cardData}
                  text={text}
                  fileName={fileName}
                  sanitizeFileName={sanitizeFileName} // pass down for consistent names
                />
              )}
            </CardLayout>
          </Col>
        </Row>

        {/* History */}
        <Row className="mt-4">
          <Col xs={12}>
            <CardLayout title={`History (${historyCount})`}>
              <QRHistory items={history} onDelete={handleDeleteHistory} />
            </CardLayout>
          </Col>
        </Row>
      </Container>

      {/* Toasts */}
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
