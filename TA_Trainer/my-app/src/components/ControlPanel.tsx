import { Button, Col } from 'react-bootstrap';
import { Card }  from '../interfaces/card';
import CARDS from '../assets/cards.json';
import { getRandomElement } from '../utilities/data';

export function ControlPanel({setCard}: {setCard: (c: Card)=>void}): JSX.Element {
    return <Col>
    <h1>Control Panel</h1>
    <Button onClick={
        () => setCard(getRandomElement(CARDS as Card[]))
    }>Swap Current Card</Button>
    </Col>
}