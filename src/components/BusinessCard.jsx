import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button, Stack } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

/**
 * BusinessCard
 *
 * Props:
 * - cardData: { name, role, email, phone, website }
 * - text: string               // custom QR content; if empty, we'll derive a MECARD from cardData
 * - fileName: string           // base filename from parent
 * - sanitizeFileName: (s)=>s   // same sanitizer used elsewhere
 *
 * UX:
 * - Renders a two-sided business card (Front: details, Back: QR).
 * - Download Front / Back as high-DPI PNGs (uses html2canvas with scale).
 *
 * Implementation notes for beginners:
 * - We keep separate refs for front and back so each can be exported individually.
 * - For QR contents: if user typed `text`, we use it; otherwise we auto-build a simple
 *   MECARD string from the provided contact fields so the QR is still useful.
 */
export default function BusinessCard({
  cardData,
  text,
  fileName,
  sanitizeFileName,
}) {
  const frontRef = useRef(null);
  const backRef = useRef(null);

  // Build QR value: prefer explicit text; else derive a simple MECARD.
  const qrValue = (text && text.trim()) || buildMeCard(cardData);

  // Use provided filename or fallback to person's name or "business-card"
  const baseName =
    sanitizeFileName?.(fileName) ||
    sanitizeFileName?.(cardData?.name || "business-card") ||
    "business-card";

  // Export helper: capture a DOM node to high-DPI PNG
  const exportNode = async (node, suffix) => {
    if (!node) return;
    const canvas = await html2canvas(node, {
      // Higher scale -> sharper export (at cost of file size)
      scale: Math.max(2, window.devicePixelRatio || 2),
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = `${baseName}-${suffix}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadFront = () => exportNode(frontRef.current, "front");
  const downloadBack = () => exportNode(backRef.current, "back");
  const downloadBoth = async () => {
    // fire sequential downloads; simple & works cross-browser
    await exportNode(frontRef.current, "front");
    await exportNode(backRef.current, "back");
  };

  return (
    <div className="text-center">
      {/* Layout: side-by-side on md+, stacked on xs */}
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-3">
        {/* FRONT SIDE */}
        <div
          ref={frontRef}
          className="border rounded shadow-sm p-4 d-flex flex-column justify-content-center"
          style={{
            width: "100%",
            maxWidth: 420,
            // Standard business card aspect ratio ~ 85mm x 54mm -> ~1.574
            aspectRatio: "85 / 54",
            background:
              "linear-gradient(135deg, rgba(13,110,253,0.08), rgba(25,135,84,0.08))",
          }}
        >
          <div className="text-start">
            <h3 className="fw-bold mb-1">
              {cardData?.name?.trim() || "John Doe"}
            </h3>
            <div className="text-muted mb-3">
              {cardData?.role?.trim() || "Full Stack Developer"}
            </div>

            <div className="small">
              <div className="mb-1">
                <span className="fw-semibold">Email:</span>{" "}
                {cardData?.email?.trim() || "john@example.com"}
              </div>
              <div className="mb-1">
                <span className="fw-semibold">Phone:</span>{" "}
                {cardData?.phone?.trim() || "+1234567890"}
              </div>
              <div className="mb-1">
                <span className="fw-semibold">Website:</span>{" "}
                {cardData?.website?.trim() || "https://example.com"}
              </div>
            </div>

            {/* Subtle brand bar */}
            <div
              className="mt-auto rounded"
              style={{
                height: 6,
                background:
                  "linear-gradient(90deg, rgba(13,110,253,0.6), rgba(25,135,84,0.6))",
              }}
            />
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          ref={backRef}
          className="border rounded shadow-sm p-4 d-flex flex-column align-items-center justify-content-center"
          style={{
            width: "100%",
            maxWidth: 420,
            aspectRatio: "85 / 54",
            backgroundColor: "#fff",
          }}
        >
          {/* Card title */}
          <div className="text-muted small mb-2">Scan Me</div>

          {/* QR on the back: we render a Canvas so html2canvas captures it natively */}
          <QRCodeCanvas
            id="card-qr-canvas"
            value={qrValue || "https://example.com"}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />

          {/* What the QR encodes */}
          <div className="text-muted small mt-2 text-wrap text-break px-2">
            {qrValue}
          </div>

          {/* Brand bar */}
          <div
            className="mt-auto w-100 rounded"
            style={{
              height: 6,
              background:
                "linear-gradient(90deg, rgba(13,110,253,0.6), rgba(25,135,84,0.6))",
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <Stack
        direction="horizontal"
        gap={2}
        className="justify-content-center flex-wrap mt-3"
      >
        <Button variant="outline-secondary" onClick={downloadFront}>
          Download Front
        </Button>
        <Button variant="outline-secondary" onClick={downloadBack}>
          Download Back
        </Button>
        <Button variant="success" onClick={downloadBoth}>
          Download Both
        </Button>
      </Stack>
    </div>
  );
}

/**
 * Build a simple MECARD from contact fields for QR use.
 * Only includes fields that are present; safe defaults are empty.
 * This is a lightweight alternative to vCard that most scanner apps support.
 */
function buildMeCard({ name, phone, email, website } = {}) {
  const parts = [];
  if (name && name.trim()) parts.push(`N:${escapeField(name)}`);
  if (phone && phone.trim()) parts.push(`TEL:${escapeField(phone)}`);
  if (email && email.trim()) parts.push(`EMAIL:${escapeField(email)}`);
  if (website && website.trim()) parts.push(`URL:${escapeField(website)}`);
  if (parts.length === 0) return ""; // no info -> caller will fallback
  return `MECARD:${parts.join(";")};`;
}

/** Escape MECARD-reserved characters (basic) */
function escapeField(s = "") {
  // Escape semicolons and colons to be safe inside MECARD
  return String(s).replace(/([;:])/g, "\\$1");
}
