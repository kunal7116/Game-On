import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/PaymentPage.css';

function PaymentPage() {
    const { leagueId } = useParams();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [paymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const base64Url = storedToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(window.atob(base64));

            const userIdFromToken = decodedToken.user_id;

            if (userIdFromToken) {
                setUserId(userIdFromToken);
            } else {
                setMessage('User ID not found in the token. Please log in again.');
                navigate('/login');
            }
        } else {
            setMessage('No token found in localStorage. Please log in.');
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setMessage('User ID not found. Please try again.');
            return;
        }

        const paymentData = {
            amount,
            leagueId: parseInt(leagueId),
            paymentDate,
            paymentTime,
            userId,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/payments', paymentData);
            setMessage('Payment successful! Redirecting to the homepage...');
            console.log(response.data);
            setTimeout(() => {
                navigate('/'); // Navigate to the homepage after 5 seconds
            }, 5000);
        } catch (error) {
            console.error('Error:', error.response?.data);
            setMessage('Payment failed. Please try again.');
        }
    };

    return (
        <Container className="payment-page-container">
            <h2>Payment for League {leagueId}</h2>
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={amount}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formPaymentDate">
                            <Form.Label>Payment Date</Form.Label>
                            <Form.Control
                                type="text"
                                name="paymentDate"
                                value={paymentDate}
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formPaymentTime">
                            <Form.Label>Payment Time</Form.Label>
                            <Form.Control
                                type="text"
                                name="paymentTime"
                                value={paymentTime}
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="danger" type="submit" className="mt-4">
                    Pay Now
                </Button>
            </Form>
        </Container>
    );
}

export default PaymentPage;
