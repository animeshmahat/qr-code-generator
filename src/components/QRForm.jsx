import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

/**
 * QRForm:
 * - Controlled inputs for QR config (text, format, size).
 * - Includes extra fields for Business Card mode (name, role, email, phone, website).
 */
export default function QRForm({
  text,
  onTextChange,
  format,
  onFormatChange,
  size,
  onSizeChange,
  cardData,
  onCardDataChange,
}) {
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

      {/* Format + Size */}
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

      {/* Business Card Fields */}
      <hr />
      <h6 className="fw-bold">Business Card Info</h6>
      <Form.Group className="mb-2">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="John Doe"
          value={cardData.name}
          onChange={(e) =>
            onCardDataChange({ ...cardData, name: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Role</Form.Label>
        <Form.Control
          type="text"
          placeholder="Software Engineer"
          value={cardData.role}
          onChange={(e) =>
            onCardDataChange({ ...cardData, role: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="john@example.com"
          value={cardData.email}
          onChange={(e) =>
            onCardDataChange({ ...cardData, email: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="+1234567890"
          value={cardData.phone}
          onChange={(e) =>
            onCardDataChange({ ...cardData, phone: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Website</Form.Label>
        <Form.Control
          type="text"
          placeholder="https://example.com"
          value={cardData.website}
          onChange={(e) =>
            onCardDataChange({ ...cardData, website: e.target.value })
          }
        />
      </Form.Group>

      <div className="text-center mt-3">
        <Button variant="primary" type="submit" className="px-4">
          Generate / Update
        </Button>
      </div>
    </Form>
  );
}
