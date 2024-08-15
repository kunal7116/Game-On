import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/LeagueCard.css';

function LeagueCard({ title, description, link, image }) {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate(link); // Navigates to the registration form
    };

    return (
        <Card className="custom-league-card">
            <div className="card-content">
                <Card.Body className="card-text">
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                    <Button variant="danger" onClick={handleRegisterClick}>Register</Button>
                </Card.Body>
                <Card.Img className="league-image" variant="right" src={image} />
            </div>
        </Card>
    );
}

export default LeagueCard;
