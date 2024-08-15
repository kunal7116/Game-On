import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/RegistrationForm.css';

function RegistrationForm() {
    const { leagueId } = useParams();
    const [formData, setFormData] = useState({
        teamName: '',
        captainFirstName: '',
        captainLastName: '',
        captainPhoneNumber: '',
        captainEmail: '',
        teamLogo: null,
        verification: false,
        sportId: 1,  // Replace with actual sportId from your logic
        leagueId: parseInt(leagueId) || 1,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            teamLogo: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post('/api/registered-teams', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            // Handle successful registration here
        } catch (error) {
            console.error('Error:', error);
            // Handle errors here
        }
    };

    return (
        <Container className="registration-form-container">
            <h2>Registration Form for League {leagueId}</h2>
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
                                type="tel"
                                name="captainPhoneNumber"
                                value={formData.captainPhoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

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

                <Form.Group controlId="formTeamLogo">
                    <Form.Label>Team Logo</Form.Label>
                    <Form.Control
                        type="file"
                        name="teamLogo"
                        onChange={handleFileChange}
                        required
                    />
                </Form.Group>
                <br />

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default RegistrationForm;
