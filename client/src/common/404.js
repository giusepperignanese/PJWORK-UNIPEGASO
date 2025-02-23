import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./403.css";

const UserNotAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Container className="unauthorized-page text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-1 text-danger mb-4">404</h1>
          <h2 className="mb-4">Pagina non trovata</h2>
          <p className="text-muted mb-4">
            La pagina che stai cercando non esiste.
          </p>
          <Button variant="primary" size="lg" onClick={handleGoBack}>
            Torna alla Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UserNotAuthorized;
