import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Calendar, ClipboardList, LogOut, User, Mail } from 'lucide-react';

const CustomerHome = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Effettua una Prenotazione',
      description: 'Prenota un nuovo appuntamento',
      icon: <Calendar size={24} />,
      link: '/reserve',
      variant: 'primary'
    },
    {
      title: 'Le Tue Prenotazioni',
      description: 'Visualizza e gestisci le prenotazioni',
      icon: <ClipboardList size={24} />,
      link: '/reservations',
      variant: 'secondary'
    }
  ];

  return (
    <Container fluid className="py-5 px-3 px-md-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {/* User Profile Card */}
          <Card className="shadow-sm mb-4 border-0">
            <Card.Body className="text-center py-4">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                <User size={32} className="text-primary" />
              </div>
              <Card.Title className="h3 mb-4">
                Benvenut*, {userData?.firstName} {userData?.lastName}!
              </Card.Title>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <Mail size={18} className="text-muted" />
                <span className="text-muted">{userData?.email}</span>
              </div>
            </Card.Body>
          </Card>

          {/* Menu Options */}
          <Row className="g-4">
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

          {/* Logout Button */}
          <div className="text-center mt-4">
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

export default CustomerHome;