import { useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";

/**
 * QRExport component:
 * - Allows user to name the exported file.
 * - Provides "Download PNG" and "Download SVG" options.
 *
 * Props:
 * - text (string): input text encoded into QR code.
 */
export default function QRExport({ text }) {
  const [fileName, setFileName] = useState("qr-code"); // default file name

  if (!text) return null;

  // Utility: sanitize filename (remove spaces/special chars)
  const sanitizeFileName = (name) =>
    name.trim().replace(/[^a-z0-9-_]/gi, "_") || "qr-code";

  // Export PNG
  const downloadPNG = () => {
    const canvas = document.querySelector("canvas");
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = sanitizeFileName(fileName) + ".png";
    link.click();
  };

  // Export SVG
  const downloadSVG = () => {
    const svg = document.querySelector("svg");
    if (!svg) return alert("SVG not available in current mode!");

    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svg)], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sanitizeFileName(fileName) + ".svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 text-center">
      <h6 className="mb-3">Export Options</h6>

      {/* File Name Input */}
      <Form.Group className="mb-3" controlId="filenameInput">
        <Form.Control
          type="text"
          placeholder="Enter file name (default: qr-code)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </Form.Group>

      {/* Download Buttons */}
      <ButtonGroup>
        <Button variant="success" onClick={downloadPNG}>
          Download PNG
        </Button>
        <Button variant="outline-secondary" onClick={downloadSVG}>
          Download SVG
        </Button>
      </ButtonGroup>
    </div>
  );
}
