import React from 'react';
import './App.css';
import CARDS from './assets/cards.json';
import { CardViewer } from './components/CardViewer';
import { ControlPanel } from './components/ControlPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap';

function App(): JSX.Element {
  return (
    <Container className="App">
      <Row>
        <ControlPanel></ControlPanel>
        <CardViewer></CardViewer>
      </Row>
    </Container>
  );
}

export default App;
