import { Card } from "react-bootstrap";

/**
 * CardLayout:
 * - Reusable card wrapper for consistent spacing and look.
 */
export default function CardLayout({ title, children }) {
  return (
    <Card className="p-4 shadow-sm bg-light border-0">
      <Card.Body>
        {title && <h3 className="text-center mb-4">{title}</h3>}
        {children}
      </Card.Body>
    </Card>
  );
}
