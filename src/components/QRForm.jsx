import { useState } from "react";
import { Form, Button } from "react-bootstrap";

/**
 * QRForm component:
 * - Handles user input (text or URL).
 * - Notifies parent component (App.jsx) when input changes.
 *
 * Props:
 * - onTextChange (function): called whenever input text changes.
 */
export default function QRForm({ onTextChange }) {
  // Local state for the text field
  const [input, setInput] = useState("");

  // Update local state and notify parent
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onTextChange(value); // send the value up to App.jsx
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Enter Text / URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="https://example.com"
          value={input}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Button currently doesn’t do anything (QR preview will be live).
          We'll keep it here for UX (and can hook functionality later). */}
      <div className="text-center">
        <Button variant="primary" disabled={!input} className="px-4">
          Generate QR
        </Button>
      </div>
    </Form>
  );
}
