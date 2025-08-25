import { useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

/**
 * QRExport:
 * - Custom filename input with sanitization.
 * - Download PNG/SVG.
 * - Save current QR to history.
 */
export default function QRExport({
  text,
  format,
  fileName,
  onFileNameChange,
  sanitizeFileName,
  onSaveToHistory,
}) {
  const [localName, setLocalName] = useState(fileName || "qr-code");

  // Keep input in sync if parent changes filename elsewhere
  useEffect(() => {
    setLocalName(fileName || "qr-code");
  }, [fileName]);

  if (!text) return null;

  const handleNameChange = (e) => {
    const v = e.target.value;
    setLocalName(v);
    onFileNameChange(v);
  };

  const downloadPNG = () => {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) {
      alert("PNG export needs Canvas mode. Switch 'Render As' to Canvas.");
      return;
    }
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFileName(localName)}.png`;
    link.click();
  };

  const downloadSVG = () => {
    const svg = document.getElementById("qr-svg");
    if (!svg) {
      alert("SVG export needs SVG mode. Switch 'Render As' to SVG.");
      return;
    }
    const serializer = new XMLSerializer();
    const blob = new Blob([serializer.serializeToString(svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFileName(localName)}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 text-center">
      <h6 className="mb-3">Export</h6>

      {/* Custom filename */}
      <Form.Group className="mb-3" controlId="filenameInput">
        <Form.Control
          type="text"
          placeholder="Enter file name (default: qr-code)"
          value={localName}
          onChange={handleNameChange}
        />
        <Form.Text className="text-muted">
          Only letters, numbers, hyphens and underscores will be kept.
        </Form.Text>
      </Form.Group>

      {/* Download + Save buttons */}
      <Stack
        direction="horizontal"
        gap={2}
        className="justify-content-center flex-wrap"
      >
        <Button
          variant="success"
          onClick={downloadPNG}
          disabled={!document.getElementById("qr-canvas")}
        >
          Download PNG
        </Button>
        <Button
          variant="outline-secondary"
          onClick={downloadSVG}
          disabled={!document.getElementById("qr-svg")}
        >
          Download SVG
        </Button>
        <Button variant="outline-primary" onClick={onSaveToHistory}>
          Save to History
        </Button>
      </Stack>
    </div>
  );
}
