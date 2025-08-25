import { Button, Row, Col, Card, Badge } from "react-bootstrap";

/**
 * QRHistory:
 * - Displays saved QR entries with preview, filename, and actions.
 * - Items contain: id, text, fileName, format, size, previewUrl, savedAt
 */
export default function QRHistory({ items, onDelete }) {
  if (!items || items.length === 0) {
    return <p className="text-muted text-center mb-0">No saved items yet.</p>;
  }

  const redownload = (item) => {
    // Redownload as whatever preview format is stored
    const link = document.createElement("a");
    const ext = item.format === "svg" ? "svg" : "png";
    link.href = item.previewUrl;
    link.download = `${item.fileName}.${ext}`;
    link.click();
  };

  return (
    <Row className="g-3">
      {items.map((item) => (
        <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <img
                src={item.previewUrl}
                alt={item.fileName}
                className="border rounded mb-2"
                style={{ width: 128, height: 128, objectFit: "contain" }}
              />
              <div className="mb-2">
                <Badge bg="secondary" className="me-2 text-uppercase">
                  {item.format}
                </Badge>
                <Badge bg="light" text="dark">
                  {item.size}px
                </Badge>
              </div>
              <Card.Title
                className="h6 w-100 text-truncate"
                title={item.fileName}
              >
                {item.fileName}
              </Card.Title>
              <Card.Text className="small text-muted w-100" title={item.text}>
                {item.text.length > 60
                  ? item.text.slice(0, 57) + "..."
                  : item.text}
              </Card.Text>

              <div className="mt-auto d-flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => redownload(item)}
                >
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
