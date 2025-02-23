import React, { useState } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import axios from 'axios';

const AvailabilityCalendar = () => {
  const [selectedSlots, setSelectedSlots] = useState({});
  const userData = JSON.parse(localStorage.getItem('userData'));

  const days = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica'
  ];

  const timeSlots = Array.from(
    { length: 10 },
    (_, i) => `${String(9 + i).padStart(2, '0')}:00-${String(10 + i).padStart(2, '0')}:00`
  );

  const queryClient = useQueryClient();

  const { mutate: submitAvailability, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/disponibilita/${userData.id}`, {
        availability: selectedSlots
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Disponibilità aggiornata con successo!');
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: () => {
      alert('Errore durante l\'aggiornamento della disponibilità.');
    }
  });

  const handleSlotSelection = (day, slot) => {
    setSelectedSlots(prev => {
      const updatedSlots = { ...prev };
      if (!updatedSlots[day]) {
        updatedSlots[day] = []; // Inizializza come array vuoto se non esiste
      }
      if (updatedSlots[day].includes(slot)) {
        updatedSlots[day] = updatedSlots[day].filter(s => s !== slot); // Rimuovi la slot se già presente
      } else {
        updatedSlots[day].push(slot); // Aggiungi la slot se non presente
      }
      return updatedSlots;
    });
  };

  const handleSelectAll = (day) => {
    setSelectedSlots(prev => {
      const updatedSlots = { ...prev };
      updatedSlots[day] = timeSlots; // Seleziona tutte le slot
      return updatedSlots;
    });
  };

  const handleDeselectAll = (day) => {
    setSelectedSlots(prev => {
      const updatedSlots = { ...prev };
      updatedSlots[day] = []; // Deseleziona tutte le slot
      return updatedSlots;
    });
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h2 className="mb-0">Calendario Disponibilità</h2>
        </Card.Header>
        <Card.Body className="p-4">
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {days.map(day => (
              <Col key={day}>
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-light text-center py-2">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <Clock size={18} />
                      <h5 className="mb-0">{day}</h5>
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleSelectAll(day)}
                        className="me-2"
                      >
                        Seleziona Tutto
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeselectAll(day)}
                      >
                        Deseleziona Tutto
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      {timeSlots.map(slot => (
                        <Form.Check
                          key={slot}
                          type="checkbox"
                          id={`${day}-${slot}`}
                          label={slot}
                          className="mb-2"
                          checked={selectedSlots[day]?.includes(slot) || false} // Usa l'operatore opzionale (?.) per evitare errori
                          onChange={() => handleSlotSelection(day, slot)}
                        />
                      ))}
                    </Form>
                    <div className="text-muted mt-2">
                      {selectedSlots[day]?.length || 0} fasce selezionate
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => submitAvailability()}
              disabled={isLoading}
              className="px-4"
            >
              {isLoading ? 'Salvataggio...' : 'Salva Disponibilità'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AvailabilityCalendar;