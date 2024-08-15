import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/SportsPage.css';
import { useParams } from 'react-router-dom';

function SportsPage() {
    const [sports, setSports] = useState([]);
    const navigate = useNavigate();
    const { cityId } = useParams();

    useEffect(() => {
        if (cityId) {
            const fetchSports = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/sports/city/${cityId}`);
                    setSports(response.data);
                } catch (error) {
                    console.error('Error fetching sports:', error);
                }
            };

            fetchSports();
        }
    }, [cityId]);

    const handleSportClick = (sportId) => {
        navigate('/leagues', { state: { sportId } });
    };

    return (
        <Container className="sports-page">
            <h2>Select Your Sport</h2>
            <p>Select a sport to proceed to the leagues selection page.</p>
            <Row>
                {sports.map((sport) => (
                    <Col
                        key={sport.sportId} // Ensure a unique key
                        xs={6}
                        sm={4}
                        md={3}
                        className="sport-box"
                        onClick={() => handleSportClick(sport.sportId)}
                        style={{ cursor: 'pointer' }}
                    >
                        {sport.sportName || "Unnamed Sport"} {/* Ensure something is displayed */}
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default SportsPage;
