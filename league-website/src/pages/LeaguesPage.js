import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button, Card, Accordion, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../assets/styles/LeaguesPage.css';

function LeaguesPage() {
    const navigate = useNavigate();
    const { sportId } = useParams();
    const [leagues, setLeagues] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/leagues/sport/${sportId}`);
                setLeagues(response.data);
            } catch (error) {
                setError('There was an error fetching the leagues.');
                console.error('Error fetching leagues:', error);
            }
        };

        if (sportId) {
            fetchLeagues();
        }
    }, [sportId]);

    const handleRegisterClick = (leagueId) => {
        navigate(`/register/${leagueId}`);
    };

    return (
        <Container className="leagues-page">
            <h2>Select Your League</h2>
            <p>Select a league to register.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Accordion defaultActiveKey="0">
                {leagues.length > 0 ? (
                    leagues.map((league, index) => (
                        <Card key={league.leagueId}>
                            <Accordion.Item eventKey={String(index)}>
                                <Accordion.Header>
                                    {league.leagueName}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <p><strong>Start Date:</strong> {new Date(league.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(league.endDate).toLocaleDateString()}</p>
                                    <p><strong>Entry Fee:</strong> {league.entryFee}</p>
                                    <p><strong>Prize Money:</strong> {league.prizeMoney}</p>
                                    <p><strong>Rules:</strong> {league.rules}</p>
                                    <Button variant="primary" onClick={() => handleRegisterClick(league.leagueId)}>
                                        Register
                                    </Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Card>
                    ))
                ) : (
                    <p>No leagues available for this sport.</p>
                )}
            </Accordion>
        </Container>
    );
}

export default LeaguesPage;
