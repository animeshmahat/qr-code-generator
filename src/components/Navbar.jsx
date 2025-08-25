import { Navbar, Container } from "react-bootstrap";

/**
 * AppNavbar:
 * - Minimal top bar
 */
export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Container>
        <Navbar.Brand href="#">QR Code Generator</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
