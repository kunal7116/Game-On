import React from 'react';
import { Container } from 'react-bootstrap';
import '../assets/styles/AdminDashboard.css'

function HomePage() {
    return (
        <div className="homepage-background">
            <Container className="text-overlay">
                <h1 className="dashboard-title">Game On Admin Dashboard</h1>
            </Container>
        </div>
    );
}

export default HomePage;
