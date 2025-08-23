import { QRCodeCanvas } from "qrcode.react";
import { Card } from "react-bootstrap";

/**
 * QRPreview component:
 * - Displays QR code based on user input.
 * - Uses 'qrcode.react' for generating QR codes.
 *
 * Props:
 * - text (string): the input string to be converted into QR code.
 */
export default function QRPreview({ text }) {
  if (!text) {
    return null; // if no input, don't render anything
  }

  return (
    <Card className="mt-4 p-3 text-center shadow-sm">
      <h5 className="mb-3">Your QR Code</h5>

      {/* QRCodeCanvas generates a <canvas> element with QR */}
      <QRCodeCanvas
        value={text} // content encoded in QR
        size={200} // size in pixels
        bgColor="#ffffff" // background color
        fgColor="#000000" // QR color
        level="H" // error correction level (H = high)
        includeMargin={true} // adds spacing around QR
        className="mx-auto"
      />

      <p className="mt-3 text-muted">
        This QR encodes: <strong>{text}</strong>
      </p>
    </Card>
  );
}
