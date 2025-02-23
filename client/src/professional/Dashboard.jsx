import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { Calendar, ClipboardList, LogOut, User, BarChart2, Clock } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const ProfessionalHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userData'));
  const userData = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isLoggedIn || userData?.role !== 'professional') return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`/api/professionista/${userData.id}/reservations`);
        setAppointments(response.data.reservations);
      } catch (error) {
        console.error('Errore durante il caricamento delle prenotazioni:', error);
        setError('Errore durante il caricamento delle prenotazioni');
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/login');
  };


  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: 'warning', text: 'In attesa' },
      confirmed: { variant: 'success', text: 'Confermato' },
      cancelled: { variant: 'danger', text: 'Cancellato' },
      completed: { variant: 'info', text: 'Completato' },
      paid: { variant: 'success', text: 'Pagato' },
      to_pay: { variant: 'secondary', text: 'In attesa di pagamento' }
    };
    const statusInfo = statusMap[status.toLowerCase()] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (!isLoggedIn) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-4">Sessione Scaduta</h3>
            <p>Non sei autenticato. Per favore, effettua il <Link to="/login">login</Link>.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (userData.role !== 'professional') {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-4">Accesso Negato</h3>
            <p>Solo i professionisti possono accedere a questa pagina.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const menuItems = [
    {
      title: 'Analytics',
      description: 'Visualizza le statistiche',
      icon: <BarChart2 size={24} />,
      link: '/analytics',
      variant: 'success'
    },
    {
      title: 'Aggiorna Disponibilità',
      description: 'Gestisci il tuo calendario',
      icon: <Calendar size={24} />,
      link: '/updatecalendar',
      variant: 'primary'
    }
  ];

  return (
    <Container fluid className="py-5 px-3 px-md-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Body className="text-center py-4">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                <User size={32} className="text-primary" />
              </div>
              <Card.Title className="h3 mb-4">
                Benvenuto, {userData?.firstName} {userData?.lastName}!
              </Card.Title>
            </Card.Body>
          </Card>

          <Row className="g-4 mb-4">
            {menuItems.map((item, index) => (
              <Col xs={12} md={6} key={index}>
                <Link to={item.link} className="text-decoration-none">
                  <Card
                    className="h-100 shadow-sm border-0 hover-shadow"
                    style={{
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                      <div className={`rounded-circle bg-${item.variant} bg-opacity-10 p-3 mb-3`}>
                        {React.cloneElement(item.icon, { className: `text-${item.variant}` })}
                      </div>
                      <Card.Title className="h5 mb-2">{item.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center gap-2">
                <ClipboardList size={20} />
                <h5 className="mb-0">Prenotazioni Ricevute</h5>
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <div className="text-center py-4 text-danger">
                  {error}
                </div>
              ) : appointments.length > 0 ? (
                <ListGroup variant="flush">
                  {appointments.map((appointment) => (
                    <ListGroup.Item
                      key={appointment._id}
                      className="py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{appointment.customer_info.name}</h6>
                          <div className="text-muted small mb-2">
                            <Clock size={14} className="me-1" />
                            {(appointment.slot_id)}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  Nessuna prenotazione disponibile.
                </div>
              )}
            </Card.Body>
          </Card>

          <div className="text-center">
            <Button
              variant="outline-danger"
              className="px-4 py-2"
              onClick={handleLogout}
            >
              <div className="d-flex align-items-center justify-content-center gap-2">
                <LogOut size={18} />
                <span>Logout</span>
              </div>
            </Button>
          </div>
        </Col>
      </Row>

      <style>{`
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
      `}</style>
    </Container>
  );
};

export default ProfessionalHome;
