import Link from "next/link";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function AuthPage() {
  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        {/* Sellers Section */}
        <Col md={6} className="text-center border-end">
          <span className="badge bg-dark text-uppercase px-3 py-2">
            Business
          </span>
          <h2 className="fw-bold mt-3">
            For <span className="fst-italic">Sellers</span>
          </h2>
          <p className="text-muted">
            Manage your store, list products, and track sales with ease.
          </p>
          <Button href="/login" variant="dark" className="w-50">
            Login
          </Button>
          <p className="mt-3">
            Don&apos;t have an account?{" "}
            <Link href="/seller/signup" className="text-success fw-bold">
              Sign up
            </Link>
            .
          </p>
        </Col>

        {/* Students Section */}
        <Col md={6} className="text-center">
          <h2 className="fw-bold mt-3">
            For <span className="fst-italic">Students</span>
          </h2>
          <p className="text-muted">
            Browse products, place orders, and track deliveries seamlessly.
          </p>
          <Button href="/login" variant="outline-dark" className="w-50">
            Login
          </Button>
          <p className="mt-3">
            Don&apos;t have an account?{" "}
            <Link href="/student/signup" className="text-success fw-bold">
              Sign up
            </Link>
            .
          </p>
        </Col>
      </Row>
    </Container>
  );
}
