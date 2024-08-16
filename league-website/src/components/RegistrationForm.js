import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/RegistrationForm.css';

function RegistrationForm() {
    const { sportId, leagueId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        teamName: '',
        captainFirstName: '',
        captainLastName: '',
        captainPhoneNumber: '',
        captainEmail: '',
    });

    const [registrationDate] = useState(new Date().toISOString().split('T')[0]); // Set today's date
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem('token');
        if (storedData) {
            const token = storedData;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(window.atob(base64));
            const userId = decodedToken.user_id;

            if (userId) {
                setUserId(userId);
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setMessage('User ID not found. Please try again.');
            return;
        }

        const dataToSend = {
            ...formData,
            registrationDate,
            leagueId: parseInt(leagueId),
            sportsId: parseInt(sportId),
            userId,
        };

        console.log("Data being sent:", dataToSend);

        try {
            const response = await axios.post('http://localhost:8080/api/registered-teams', dataToSend);
            setMessage('Registration successful!');
            console.log(response.data);
            navigate(`/payment/${leagueId}`);  // Navigate to payment page
        } catch (error) {
            console.error('Error:', error.response?.data);
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <Container className="registration-form-container">
            <h2>Registration Form for League {leagueId}</h2>
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formTeamName">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formCaptainFirstName">
                            <Form.Label>Captain's First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="captainFirstName"
                                value={formData.captainFirstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formCaptainLastName">
                            <Form.Label>Captain's Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="captainLastName"
                                value={formData.captainLastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formCaptainPhoneNumber">
                            <Form.Label>Captain's Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="captainPhoneNumber"
                                value={formData.captainPhoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formCaptainEmail">
                            <Form.Label>Captain's Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="captainEmail"
                                value={formData.captainEmail}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formRegistrationDate">
                            <Form.Label>Registration Date</Form.Label>
                            <Form.Control
                                type="text"
                                name="registrationDate"
                                value={registrationDate}
                                readOnly // Prevents editing
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="danger" type="submit" className="mt-4">
                    Register
                </Button>
            </Form>
        </Container>
    );
}

// The export statement should be at the top level, outside any block or function
export default RegistrationForm;
