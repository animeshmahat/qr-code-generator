import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Card } from "react-bootstrap";

/**
 * QRPreview:
 * - Renders either a Canvas or SVG QR with stable IDs for export.
 * - Size controlled by parent.
 */
export default function QRPreview({ text, format, size }) {
  if (!text) return null;

  return (
    <Card className="mt-4 p-3 text-center shadow-sm">
      <h5 className="mb-3">Preview</h5>

      {format === "canvas" ? (
        <QRCodeCanvas
          id="qr-canvas" // <-- used for PNG export
          value={text}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
      ) : (
        <QRCodeSVG
          id="qr-svg" // <-- used for SVG export
          value={text}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
      )}

      <p className="mt-3 text-muted small mb-0">
        Encodes: <strong>{text}</strong>
      </p>
    </Card>
  );
}
