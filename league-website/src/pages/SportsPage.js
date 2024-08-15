import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/SportsPage.css';

function SportsPage() {
    const [sports, setSports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { cityId } = useParams();

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/sports/city/${cityId}`);
                setSports(response.data);
            } catch (error) {
                setError('Error fetching sports');
                console.error('Error fetching sports:', error);
            }
        };

        if (cityId) {
            fetchSports();
        }
    }, [cityId]);

    const handleSportClick = (sportId) => {
        navigate(`/leagues/${sportId}`);
    };

    return (
        <Container className="sports-page">
            <h2>Select Your Sport</h2>
            <p>Select a sport to proceed to the leagues selection page.</p>
            {error ? (
                <p>{error}</p>
            ) : (
                <Row>
                    {sports.map((sport) => (
                        <Col
                            key={sport.sportsId}
                            xs={6}
                            sm={4}
                            md={3}
                            className="sport-box"
                            onClick={() => handleSportClick(sport.sportsId)}
                            style={{ cursor: 'pointer' }}
                        >
                            {sport.sportType || 'Unnamed Sport'}
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default SportsPage;
