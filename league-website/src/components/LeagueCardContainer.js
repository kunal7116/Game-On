import React, { useRef } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import LeagueCard from './LeagueCard';
import leagueImage1 from '../assets/images/league-1.jpg';
import leagueImage2 from '../assets/images/league-img2.jpg';
import leagueImage3 from '../assets/images/league-img3.jpg';
import leagueImage4 from '../assets/images/league-img4.jpg';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'; // Import both scroll icons

function LeagueCardContainer() {
    const containerRef = useRef(null);

    const scrollRight = () => {
        containerRef.current.scrollLeft += 250; // Adjust scroll amount as needed
    };

    const scrollLeft = () => {
        containerRef.current.scrollLeft -= 250; // Adjust scroll amount as needed
    };

    const leagues = [
        {
            title: 'Popular League 1',
            description: 'This is a description for League 1.',
            link: '/register/1',
            image: leagueImage1,
        },
        {
            title: 'Popular League 2',
            description: 'This is a description for League 2.',
            link: '/register/2',
            image: leagueImage2,
        },
        {
            title: 'Popular League 3',
            description: 'This is a description for League 3.',
            link: '/register/3',
            image: leagueImage3,
        },
        {
            title: 'Popular League 3',
            description: 'This is a description for League 3.',
            link: '/register/3',
            image: leagueImage4,
        },
        // Add more leagues here if needed
    ];

    return (
        <div style={{ position: 'relative' }}>
            <Container fluid className="scrollable-container" ref={containerRef}>
                <Row className="flex-nowrap">
                    {leagues.map((league, index) => (
                        <Col key={index} className="d-flex">
                            <LeagueCard
                                title={league.title}
                                description={league.description}
                                link={league.link}
                                image={league.image}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
            <FaChevronLeft className="scroll-icon left" onClick={scrollLeft} />
            <FaChevronRight className="scroll-icon right" onClick={scrollRight} />
        </div>
    );
}

export default LeagueCardContainer;
