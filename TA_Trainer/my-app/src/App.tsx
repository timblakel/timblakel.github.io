import React, { useState } from 'react';
import './App.css';
import CARDS from './assets/cards.json';
import { CardViewer } from './components/CardViewer';
import { ControlPanel } from './components/ControlPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap';
import { Card } from './interfaces/card';

function App(): JSX.Element {
  const [activeCard, setActivecard] = useState<Card>(CARDS[0] as Card);
  const [answerRevealed, setAnswerReavealed] = useState<boolean>(false);

  return (
    <Container className="App">
      <Row>
        <ControlPanel 
          setCard={setActivecard} 
          reveal={setAnswerReavealed}
          isRevealed={answerRevealed}></ControlPanel>
        <CardViewer card={activeCard} isRevealed={answerRevealed}></CardViewer>
      </Row>
    </Container>
  );
}

export default App;
