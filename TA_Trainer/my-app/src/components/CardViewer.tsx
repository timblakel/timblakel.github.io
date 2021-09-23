import { Col } from 'react-bootstrap';
import { Card } from '../interfaces/card';

export function CardViewer({card}: {card: Card}): JSX.Element {
    return <Col>
    <h1>Card Viewer</h1>
    <div>Front: {card.front}</div>
    <div>Back: {card.back}</div>
    </Col>
}