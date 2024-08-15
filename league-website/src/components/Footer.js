import React from 'react';
import { Container } from 'react-bootstrap';
import '../assets/styles/Footer.css';

function Footer() {
    return (
        <footer className="custom-footer">
            <Container className="text-center">
                <p>&copy; 2024 League Website. All Rights Reserved.</p>
            </Container>
        </footer>
    );
}

export default Footer;
