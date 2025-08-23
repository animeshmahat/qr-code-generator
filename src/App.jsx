import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import CardLayout from "./components/CardLayout";
import QRForm from "./components/QRForm";
import QRPreview from "./components/QRPreview";
import { useState } from "react";

/**
 * App component:
 * - Holds global state (input text).
 * - Renders form + QR preview together.
 */
export default function App() {
  const [text, setText] = useState(""); // global state

  return (
    <>
      <AppNavbar />

      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <CardLayout title="Generate Your QR Code">
              {/* Input Form */}
              <QRForm onTextChange={setText} />

              {/* Live QR Code Preview */}
              <QRPreview text={text} />
            </CardLayout>
          </Col>
        </Row>
      </Container>
    </>
  );
}
