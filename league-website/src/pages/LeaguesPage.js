import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Accordion } from 'react-bootstrap';
import '../assets/styles/LeaguesPage.css';

function LeaguesPage() {
    const navigate = useNavigate();  // Initialize `useNavigate`

    const leagues = [
        { id: 1, name: 'XYZ League 1', description: 'Description for XYZ League 1' },
        { id: 2, name: 'ABC League 2', description: 'Description for ABC League 2' },
        { id: 3, name: 'DEF League 3', description: 'Description for DEF League 3' },
    ];

    const handleRegisterClick = (leagueId) => {
        navigate(`/register/${leagueId}`);  // Pass leagueId to the registration form
    };

    return (
        <Container className="leagues-page">
            <h2>Select Your League</h2>
            <p>Select a league to register.</p>
            <Accordion defaultActiveKey="0">
                {leagues.map((league, index) => (
                    <Card key={league.id}>
                        <Accordion.Item eventKey={String(index)}>
                            <Accordion.Header>
                                {league.name}
                            </Accordion.Header>
                            <Accordion.Body>
                                <p>{league.description}</p>
                                <Button variant="primary" onClick={() => handleRegisterClick(league.id)}>
                                    Register
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Card>
                ))}
            </Accordion>
        </Container>
    );
}

export default LeaguesPage;
