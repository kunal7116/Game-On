import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import '../assets/styles/FeaturedLeague.css';
import winnerImg from '../assets/images/league-winner.jpg'
import winnerImg1 from '../assets/images/league-winner1.jpg'
import winnerImg2 from '../assets/images/league-winner2.jpg'

function FeaturedLeague() {
    // Static data for the featured leagues (replace with dynamic data if needed)
    const leagues = [
        {
            title: 'Big League Winner',
            description: 'This is a brief description of the featured league.',
            image: winnerImg
        },
        {
            title: 'Championship Winner',
            description: 'Details about the latest championship winner.',
            image: winnerImg1
        },
        {
            title: 'Local League Champion',
            description: 'The best team in the local league.',
            image: winnerImg2
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % leagues.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [leagues.length]);

    return (
        <Container>
            <Card className="custom-featured-league">
                <Row className="no-gutters">
                    <Col md={6}>
                        <Card.Img src={leagues[currentIndex].image} alt={leagues[currentIndex].title} />
                    </Col>
                    <Col md={6}>
                        <Card.Body>
                            <Card.Title>{leagues[currentIndex].title}</Card.Title>
                            <Card.Text>{leagues[currentIndex].description}</Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default FeaturedLeague;
