import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

/**
 * QRForm:
 * - Controlled inputs for text, format, and size.
 * - Emits changes up to App for single source of truth.
 */
export default function QRForm({
  text,
  onTextChange,
  format,
  onFormatChange,
  size,
  onSizeChange,
}) {
  // Local mirror for snappy typing, then sync up
  const [localText, setLocalText] = useState(text);

  useEffect(() => setLocalText(text), [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onTextChange(localText.trim());
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Text / URL */}
      <Form.Group className="mb-3">
        <Form.Label>Enter Text / URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="https://example.com"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
        />
        <Form.Text className="text-muted">
          Click "Generate / Update" to refresh the preview.
        </Form.Text>
      </Form.Group>

      {/* Format + Size in a row on wide screens */}
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>Render As</Form.Label>
            <Form.Select
              value={format}
              onChange={(e) => onFormatChange(e.target.value)}
            >
              <option value="canvas">Canvas (best for PNG)</option>
              <option value="svg">SVG (infinite scale)</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>Size: {size}px</Form.Label>
            <Form.Range
              min={120}
              max={512}
              step={8}
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="text-center mt-3">
        <Button variant="primary" type="submit" className="px-4">
          Generate / Update
        </Button>
      </div>
    </Form>
  );
}
