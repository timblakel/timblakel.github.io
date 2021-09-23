import { Col } from 'react-bootstrap';
import { Card } from '../interfaces/card';

export function CardViewer({card}: {card: Card}): JSX.Element {
    return <Col>
    <h1>Card Viewer</h1>
    <div>Current Card: {card.front}</div>
    </Col>
}