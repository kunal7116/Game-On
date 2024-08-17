import React from 'react';
import { Container } from 'react-bootstrap';
import '../assets/styles/LeagueProviderDashboard.css';

function LeagueProviderHomePage() {
    return (
        <div className="homepage-background">
            <Container className="text-overlay">
                <h1 className="dashboard-title">Game On League Provider Dashboard</h1>
            </Container>
        </div>
    );
}

export default LeagueProviderHomePage;
