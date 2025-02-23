import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Calendar, Clock, User, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

const ReserveSlot = () => {
  const [professionisti, setProfessionisti] = useState([]);
  const [selectedProfessionista, setSelectedProfessionista] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessionisti = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/professionista');
        setProfessionisti(response.data);
      } catch (err) {
        setError('Errore durante il caricamento dei professionisti.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessionisti();
  }, []);

  const handleProfessionistaChange = async (e) => {
    const professionistaId = e.target.value;
    setSelectedProfessionista(professionistaId);
    setSelectedSlot('');
    setSlots([]);
    setError('');

    if (professionistaId) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/disponibilita/${professionistaId}`);
        setSlots(response.data);
      } catch (err) {
        setError('Errore durante il caricamento degli slot orari.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProfessionista || !selectedSlot) {
      setError('Seleziona un professionista e uno slot orario.');
      return;
    }

    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      setError('Utente non autenticato. Effettua il login per prenotare.');
      navigate('/login');
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userDataString);
    } catch (parseError) {
      setError('Errore durante il recupero dei dati utente.');
      return;
    }

    if (!userData.firstName || !userData.lastName || !userData.email) {
      setError("Dati utente incompleti. Effettua di nuovo il login.");
      navigate('/login');
      return;
    }

    const selectedProf = professionisti.find(prof => prof._id === selectedProfessionista);
    if (!selectedProf) {
      setError('Professionista non trovato.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/reservations', {
        professionista_id: selectedProfessionista,
        professionista_nome: `${selectedProf.profile.firstName} ${selectedProf.profile.lastName}`,
        slot: selectedSlot,
        user: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || null,
        }
      });
      navigate('/reservations');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Errore durante la prenotazione.');
      } else if (err.request) {
        setError('Errore di rete. Controlla la tua connessione.');
      } else {
        setError('Errore durante la prenotazione.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedProfessionistaDetails = () => {
    return professionisti.find(prof => prof._id === selectedProfessionista)?.profile;
  };

  return (
    <Container fluid className="py-5 px-3 px-md-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="h3 mb-2">Prenota un Appuntamento</h2>
                <p className="text-muted">Seleziona un professionista e uno slot orario disponibile</p>
              </div>

              {error && (
                <Alert variant="danger" className="d-flex align-items-center gap-2">
                  <X size={18} />
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <User size={20} className="text-primary" />
                    <Form.Label className="mb-0 fw-medium">Professionista</Form.Label>
                  </div>
                  <Form.Select
                    value={selectedProfessionista}
                    onChange={handleProfessionistaChange}
                    disabled={isLoading}
                    className="form-select-lg"
                  >
                    <option value="">-- Seleziona un professionista --</option>
                    {professionisti.map((professionista) => (
                      <option key={professionista._id} value={professionista._id}>
                        {`${professionista.profile.firstName} ${professionista.profile.lastName}`}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                {selectedProfessionista && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Clock size={20} className="text-primary" />
                      <Form.Label className="mb-0 fw-medium">Slot Orario</Form.Label>
                    </div>
                    {isLoading ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" size="sm" />
                      </div>
                    ) : (
                      <Form.Select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="form-select-lg"
                      >
                        <option value="">-- Seleziona uno slot orario --</option>
                        {Object.entries(slots).map(([day, times]) => (
                          <optgroup key={day} label={day}>
                            {Array.isArray(times) && times.map((time, index) => (
                              <option key={`${day}-${index}`} value={`${day} ${time}`}>
                                {`${time}`}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Form.Select>
                    )}
                  </div>
                )}

                {selectedProfessionista && selectedSlot && (
                  <Card className="bg-light border-0 mb-4">
                    <Card.Body>
                      <h6 className="mb-3">Riepilogo Prenotazione</h6>
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <User size={16} className="text-muted" />
                          <span>{getSelectedProfessionistaDetails()?.firstName} {getSelectedProfessionistaDetails()?.lastName}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Calendar size={16} className="text-muted" />
                          <span>{selectedSlot}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 py-3"
                  disabled={isSubmitting || !selectedProfessionista || !selectedSlot}
                >
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span>Conferma Prenotazione</span>
                      <ChevronRight size={18} />
                    </div>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .form-select-lg {
          padding: 1rem;
          font-size: 1rem;
        }
        .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
      `}</style>
    </Container>
  );
};

export default ReserveSlot;