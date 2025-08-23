import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import CardLayout from "./components/CardLayout";
import QRForm from "./components/QRForm";
import { useState } from "react";

/**
 * App component:
 * - Serves as the main entry point.
 * - Holds global state (like text input).
 * - Passes state + handlers down to child components as props.
 */
export default function App() {
  const [text, setText] = useState(""); // global state for QR text

  return (
    <>
      {/* Top navigation bar */}
      <AppNavbar />

      {/* Main Content */}
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <CardLayout title="Generate Your QR Code">
              {/* Input form (child component).
                  When user types, it updates global state via setText. */}
              <QRForm onTextChange={setText} />

              {/* For now we just display text below.
                  In Step 3 we’ll show the live QR preview here. */}
              {text && (
                <p className="mt-3 text-center text-muted">
                  You entered: <strong>{text}</strong>
                </p>
              )}
            </CardLayout>
          </Col>
        </Row>
      </Container>
    </>
  );
}
