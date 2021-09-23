import { Button, Col } from 'react-bootstrap';
import { Card }  from '../interfaces/card';
import CARDS from '../assets/cards.json';
import { getRandomElement } from '../utilities/data';

export function ControlPanel({setCard, reveal, isRevealed}: {setCard: (c: Card)=>void, reveal: (r: boolean)=>void, isRevealed: boolean}): JSX.Element {
    function setRandomCard() {
        setCard(getRandomElement(CARDS as Card[]))
        reveal(false);
    }

    return <Col>
    <h1>Control Panel</h1>
    <Button onClick={setRandomCard} className="m-2">Swap Current Card</Button>
    <Button onClick={() => reveal(!isRevealed)}>Reveal Answer</Button>
    </Col>
}