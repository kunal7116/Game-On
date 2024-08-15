import React from 'react';
import ImageSlider from '../components/ImageSlider';
import FeaturedLeague from '../components/FeaturedLeague';
import { Container } from 'react-bootstrap';
import '../assets/styles/HomePage.css';
import LeagueCardContainer from '../components/LeagueCardContainer';



function HomePage() {
    return (
        <Container className="home-page">
            <ImageSlider />
            <h2 className="section-title">Popular Leagues</h2>
            {/* <Row>
                <Col md={4}><LeagueCard title="Popular League 1" description="This is a description." link="/city" /></Col>
                <Col md={4}><LeagueCard title="Popular League 2" description="This is a description." link="/city" /></Col>
                <Col md={4}><LeagueCard title="Popular League 3" description="This is a description." link="/city" /></Col>
            </Row> */}
            <LeagueCardContainer />
            <FeaturedLeague />
        </Container>
    );
}

export default HomePage;
