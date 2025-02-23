import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./403.css";
import { useNavigate } from "react-router-dom";

const quotes = [
  {
    text: "La medicina è un'arte, non una scienza. È l'arte di curare.",
    author: "Ippocrate",
  },
    {
    text: "Guarire a volte, alleviare spesso, confortare sempre.",
    author: "Ambroise Paré",
  },
  {
    text: "Non c'è cura senza conoscenza.",
     author: "Galeno",
    },
  {
    text: "La salute non è tutto, ma senza salute tutto è niente.",
    author: "Arthur Schopenhauer",
  },
  {
    text: "Il medico deve essere un amico del paziente.",
    author: "Ippocrate",
  },
  {
    text: "La miglior medicina è la prevenzione.",
    author: "Erasmo da Rotterdam",
    },
  {
      text: "Il medico del futuro non darà medicine, ma coinvolgerà e interesserà i suoi pazienti alla cura del corpo umano, all'alimentazione, e alle cause e alla prevenzione della malattia.",
      author: "Thomas Edison",
    },
      {
        text: "L'esercizio fisico è una droga, ma una droga sana.",
        author: "Tommy Boone",
      },
  {
    text: "Il buon medico cura la malattia, il grande medico cura il paziente.",
    author: "William Osler",
  },
   {
    text: "L'importante non è vivere a lungo, ma vivere bene.",
    author: "Seneca",
  },
    {
    text: "La gentilezza è una forma di medicina.",
    author: "Anonimo",
  },
  {
    text: "Il corpo umano è il miglior quadro e la malattia il suo pennello.",
    author: "Johann Wolfgang von Goethe",
  },
   {
    text: "La felicità è la vera medicina.",
    author: "Proverbio africano",
  },
  {
   text: "Ogni paziente porta con sé il proprio medico.",
   author: "Alberto Schweitzer",
  },
   {
    text: "L'igiene è la metà della salute.",
    author: "Proverbio italiano",
  },
  {
    text: "La risata è una buona medicina.",
    author: "Proverbio inglese",
  },
  {
   text: "La mente è tutto. Ciò che pensi diventi.",
   author: "Buddha",
  },
    {
    text: "L'acqua è l'unica medicina di cui ogni uomo ha bisogno.",
    author: "Benjamin Franklin",
  },
  {
    text: "Il riposo e il sonno sono i due più grandi rimedi.",
    author: "Proverbio tedesco",
  },
    {
    text: "La natura è il medico delle malattie.",
    author: "Ippocrate",
  },
  {
    text: "Chi ha la salute ha la speranza e chi ha la speranza ha tutto.",
    author: "Proverbio arabo",
   },
 {
   text: "La dieta è la prima medicina.",
   author: "Ippocrate"
  },
  {
    text: "La prevenzione è meglio della cura, e non costa neanche tanto.",
    author: "Giordano Brunetti",
   },
  {
     text: "Il sole è la migliore medicina.",
     author: "Walt Whitman",
  },
    {
     text: "L'ottimismo è la vera medicina.",
     author: "Anonimo"
    },
  {
    text: "Mens sana in corpore sano.",
    author: "Giovenale"
   },
    {
      text: "La malattia non è un ostacolo, ma un insegnamento.",
      author: "Anonimo"
    },
      {
      text: "Il più grande errore nella cura delle malattie è che ci sono medici per il corpo e medici per la mente, mentre le due cose non possono essere separate.",
      author: "Platone"
      },{
        text: "Il miglior modo per prevedere il futuro è crearlo.",
        author: "Peter Drucker",
      },
      {
        text: "La cura non è solo il rimedio, ma la capacità di ascoltare.",
        author: "Eric Cassell",
      },
      {
        text: "Un'ora di risata è un antidolorifico efficace.",
        author: "Proverbio tibetano",
      },
      {
        text: "La calma è il rimedio migliore per la frenesia della vita.",
        author: "Anonimo",
      },
      {
        text: "La pace interiore è la più grande salute.",
        author: "Lama Zopa Rinpoche",
      },
       {
        text: "Il movimento è la canzone del corpo.",
        author: "Vanda Scaravelli",
      },
      {
         text: "La vera ricchezza è la salute, non i pezzi d'oro e d'argento.",
         author: "Mahatma Gandhi"
       },
      {
        text: "La gratitudine è una delle più belle forme di salute.",
        author: "Anonimo",
      },
        {
        text: "L'amore è la migliore medicina, non ci sono dubbi.",
        author: "Patch Adams",
        },
       {
         text: "La forza fisica non si deve limitare ad avere muscoli ma si estende alla salute in generale.",
         author: "T.S. Eliot"
        },
      {
        text: "La malattia è un'esperienza, non un'identità.",
        author: "Anonimo",
      },
     {
       text: "Ogni passo verso la salute è un passo verso la felicità.",
       author: "Anonimo",
      },
     {
      text: "Il miglior dottore è la natura: è sempre precisa e guarisce tutto.",
      author: "Galileo Galilei"
      },
        {
        text: "Nutri la tua mente e il tuo corpo e non ti ammalerai mai.",
        author: "Swami Sivananda"
        },
        {
        text: "Il vero segreto per essere sani è non avere segreti.",
        author: "Anonimo"
       },
     {
        text: "La tua mente è un giardino, i tuoi pensieri sono i semi, puoi far crescere fiori o erbacce.",
       author: "Anonimo"
      },
      {
        text:"La cosa più importante è non smettere mai di porsi domande.",
        author: "Albert Einstein"
      },
      {
       text:"Il miglior farmaco contro la paura è l'accettazione.",
        author: "Carl Gustav Jung"
       },
      {
        text:"La vita è il miglior medicinale. I medici si limitano a dare una mano.",
        author: "Proverbio russo"
       }
];

const UserNotAuthorized = () => {
  const [randomQuotes, setRandomQuotes] = useState([]);
  const [quotePositions, setQuotePositions] = useState([]);
  const navigate = useNavigate();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newSize = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };
        if (newSize.width > 0 && newSize.height > 0) {
          setContainerSize(newSize);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0) {
      const shuffledIndexes = [...Array(quotes.length).keys()].sort(() => 0.5 - Math.random());
      const numQuotes = Math.floor(Math.random() * 3) + 3;
      const selectedIndexes = shuffledIndexes.slice(0, numQuotes);
      const selectedQuotes = selectedIndexes.map((index) => quotes[index]);

      setRandomQuotes(selectedQuotes);

      setQuotePositions(() => {
        const positions = [];
        selectedQuotes.forEach(() => {
          let position;
          let overlaps;
          do {
            position = {
              top: Math.random() * (containerSize.height - 100) + 50,
              left: Math.random() * (containerSize.width - 300) + 50
            };
            overlaps = positions.some(existingPosition => {
              const dist = Math.sqrt(
                Math.pow(position.left - existingPosition.left, 2) +
                Math.pow(position.top - existingPosition.top, 2)
              );
              return dist < 200;
            });
          } while (overlaps);
          positions.push(position);
        });
        return positions;
      });

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [containerSize]);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="unauthorized-page">
      <Container fluid className="h-100 d-flex align-items-center justify-content-center" ref={containerRef}>
        <Row className="text-center">
          <Col>
            <h1 className="display-1 text-danger">403</h1>
            <h2 className="mb-4">Accesso Negato</h2>
            <p className="text-muted">
              Non sei autorizzato a visualizzare questa pagina.
            </p>
            <button className="go-back-button" onClick={handleGoBack}>Torna alla Pagina di Login</button>
          </Col>
        </Row>

        {randomQuotes.map((quote, index) => (
          <div key={index} className="quote-container" style={{
            top: `${quotePositions[index]?.top}px`,
            left: `${quotePositions[index]?.left}px`,
          }}>
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">- {quote.author}</p>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default UserNotAuthorized;