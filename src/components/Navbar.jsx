import { Navbar, Container } from "react-bootstrap";

/**
 * A simple navigation bar displayed at the top of the app.
 * - Separated as its own component so it's reusable and easy to maintain.
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
