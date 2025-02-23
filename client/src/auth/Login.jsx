import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { AlertCircle, UserPlus } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        if (user.role === 'customer') {
          navigate('/home', { replace: true });
        } else if (user.role === 'professional') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/404', { replace: true });
        }
      } catch (error) {
        localStorage.removeItem('userData');
        console.error('Invalid user data in localStorage');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('auth/login', credentials);

      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role,
        firstName: response.data.user.profile.firstName,
        lastName: response.data.user.profile.lastName,
        phone: response.data.user.profile.phone
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      window.location.reload();

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Credenziali non valide');
      } else if (err.request) {
        setError('Impossibile connettersi al server. Verifica la tua connessione.');
      } else {
        setError('Si è verificato un errore durante il login');
      }
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="h3 mb-2">Benvenuto</h2>
            <p className="text-muted">Accedi al tuo account</p>
          </div>

          {error && (
            <Alert 
              variant="danger" 
              className="d-flex align-items-center gap-2 mb-4"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Form.Label className="mb-0">Email</Form.Label>
              </div>
              <Form.Control
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Inserisci la tua email"
                required
                className="py-2"
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Form.Label className="mb-0">Password</Form.Label>
              </div>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Inserisci la tua password"
                  required
                  className="py-2"
                  disabled={isLoading}
                />
                <Button
                  variant="link"
                  onClick={togglePasswordVisibility}
                  className="position-absolute end-0 top-50 translate-middle-y text-muted"
                  style={{ padding: '0.375rem' }}
                >
                </Button>
              </div>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 mb-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Accedi'
              )}
            </Button>

            <div className="text-center">
              <span className="text-muted">Non hai un account? </span>
              <Link 
                to="/register" 
                className="text-decoration-none d-inline-flex align-items-center gap-1"
              >
                <span>Registrati</span>
                <UserPlus size={16} />
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style>{`
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
        .form-control {
          border-radius: 0.375rem;
        }
      `}</style>
    </Container>
  );
};

export default Login;