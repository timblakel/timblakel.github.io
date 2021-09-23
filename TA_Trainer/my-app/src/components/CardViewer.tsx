import { Col, Card as BootstrapCard } from 'react-bootstrap';
import { Card } from '../interfaces/card';

export function CardViewer({card, isRevealed}: {card: Card, isRevealed: boolean}): JSX.Element {
    return <Col>
    <BootstrapCard>
        <BootstrapCard.Body>
            <BootstrapCard.Title>Card Viewer</BootstrapCard.Title>
            <BootstrapCard.Text>
                <div><strong>Front:</strong> {card.front}</div>
            </BootstrapCard.Text>
            {isRevealed && <BootstrapCard.Text>
                <div><strong>Back:</strong> {card.back}</div>
            </BootstrapCard.Text>}
        </BootstrapCard.Body>
    </BootstrapCard>

    </Col>
}