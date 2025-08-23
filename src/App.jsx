import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import CardLayout from "./components/CardLayout";
import QRForm from "./components/QRForm";
import QRPreview from "./components/QRPreview";
import QRExport from "./components/QRExport";
import { useState } from "react";

/**
 * App component:
 * - Uses Bootstrap's grid system to make layout adaptive.
 * - On small screens -> vertical stacking.
 * - On large screens -> side-by-side layout.
 */
export default function App() {
  const [text, setText] = useState("");

  return (
    <>
      <AppNavbar />

      <Container>
        <Row className="justify-content-center align-items-start">
          {/* Left Column: Input Form */}
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <CardLayout title="Enter Your Details">
              <QRForm onTextChange={setText} />
            </CardLayout>
          </Col>

          {/* Right Column: QR Preview + Export */}
          <Col xs={12} md={6}>
            <CardLayout title="Your QR Code">
              <QRPreview text={text} />
              <QRExport text={text} />
            </CardLayout>
          </Col>
        </Row>
      </Container>
    </>
  );
}
