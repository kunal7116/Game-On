// src/components/AdminFooter.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AdminFooter = () => (
    <footer className="bg-danger text-white text-center py-3">
        <Container>
            <Row>
                <Col>
                    <p>&copy; {new Date().getFullYear()} Gameon. All Rights Reserved.</p>
                </Col>
            </Row>
        </Container>
    </footer>
);

export default AdminFooter;
