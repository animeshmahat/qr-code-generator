import { Card } from "react-bootstrap";

/**
 * A wrapper around Bootstrap Card.
 * - Helps us avoid repeating card-related styles everywhere.
 * - Makes code cleaner and easier to maintain.
 */
export default function CardLayout({ title, children }) {
  return (
    <Card className="p-4 shadow-sm bg-light">
      <Card.Body>
        {title && <h3 className="text-center mb-4">{title}</h3>}
        {children}
      </Card.Body>
    </Card>
  );
}
