import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const MyReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noReservations, setNoReservations] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (!userData || !userData.email) {
                    setError('Dati utente non trovati.');
                    setLoading(false);
                    return;
                }
                const email = userData.email;
                const response = await axios.get(`/api/cliente/${email}/reservations`);
                setReservations(response.data.reservations);
                setNoReservations(false);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setNoReservations(true);
                    setError('');
                } else {
                    setError('Errore durante il caricamento delle prenotazioni.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleShowPaymentModal = (reservationId) => {
        setCurrentReservationId(reservationId);
        setShowPaymentModal(true);
        setPaymentSuccess(false);
        setPaymentError('');
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setCurrentReservationId(null);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        setPaymentError('');
        setPaymentSuccess(false);

        try {
            const response = await axios.post(`/api/pagamento/${currentReservationId}`, cardDetails);

            if (response.status === 200) {
                setPaymentSuccess(true);

                setReservations(prevReservations =>
                    prevReservations.map(reservation =>
                        reservation._id === currentReservationId
                            ? { ...reservation, status: 'paid' }
                            : reservation
                    )
                );

                setTimeout(handleClosePaymentModal, 2000);
            } else {
                setPaymentError('Pagamento fallito. Riprova.');
            }
        } catch (error) {
            if (error.response) {
                setPaymentError(`Errore: ${error.response.data.message || 'Errore sconosciuto dal server.'}`);
            } else if (error.request) {
                setPaymentError('Nessuna risposta ricevuta dal server.');
            } else {
                setPaymentError('Errore durante la richiesta di pagamento.');
            }
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Caricamento prenotazioni...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (noReservations) {
        return (
            <Container className="mt-4">
                <Alert variant="info">Nessuna prenotazione trovata.</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <h3 className="text-center mb-4">Le tue Prenotazioni</h3>
                    <Table striped bordered hover responsive className="table-responsive">
                        <thead className="table-dark">
                            <tr>
                                <th>Slot Orario</th>
                                <th>Stato</th>
                                <th>Data Prenotazione</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation._id}>
                                    <td>{reservation.slot_id}</td>
                                    <td>
                                        {reservation.status === 'paid' ? 'Pagato' : 'Da pagare €'}
                                    </td>
                                    <td>{new Date(reservation.created_at).toLocaleString()}</td>
                                    <td>
                                        {reservation.status === 'to_pay' ? (
                                            <Button variant="success" size="sm" onClick={() => handleShowPaymentModal(reservation._id)}>
                                                Paga
                                            </Button>
                                        ) : (
                                            <Button variant="primary" size="sm">
                                                Dettagli
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={showPaymentModal} onHide={handleClosePaymentModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pagamento Prenotazione</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {paymentSuccess ? (
                        <Alert variant="success">Pagamento effettuato con successo!</Alert>
                    ) : (
                        <>
                            {paymentError && <Alert variant="danger">{paymentError}</Alert>}
                            <Form onSubmit={handlePayment}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Numero Carta</Form.Label>
                                    <Form.Control type="text" name="cardNumber" placeholder="Inserisci numero carta" onChange={handleInputChange} required/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Data Scadenza</Form.Label>
                                    <Form.Control type="text"  name="expiryDate" placeholder="MM/AA" onChange={handleInputChange} required/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" name="cvv" placeholder="CVV" onChange={handleInputChange} required pattern="[0-9]{3,4}"/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Titolare Carta</Form.Label>
                                    <Form.Control type="text" name="cardHolder" placeholder="Titolare Carta" onChange={handleInputChange} required/>
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={paymentLoading} className="w-100">
                                    {paymentLoading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                            <span className="visually-hidden">Caricamento...</span>
                                        </>
                                    ) : (
                                        'Paga'
                                    )}
                                </Button>
                            </Form>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default MyReservationsPage;
