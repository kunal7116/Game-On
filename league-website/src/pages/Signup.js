import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'PLAYER' // Default role
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const validate = () => {
        let formErrors = {};
        let valid = true;

        if (!formData.firstname) {
            formErrors.firstname = 'First name is required';
            valid = false;
        }
        if (!formData.lastname) {
            formErrors.lastname = 'Last name is required';
            valid = false;
        }
        if (!formData.email) {
            formErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Email is invalid';
            valid = false;
        }
        if (!formData.password) {
            formErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(formErrors);
        return valid;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post('http://localhost:8080/api/users', formData);
                console.log('User created:', response.data);

                // Redirect to the login page after successful registration
                navigate('/login');

            } catch (error) {
                console.error('Error creating user:', error);
                setErrors({ ...errors, apiError: 'Failed to create user. Please try again.' });
            }
        }
    };

    return (
        <Container className="signup-container">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formfirstname">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                isInvalid={!!errors.firstname}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstname}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formlastname">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                isInvalid={!!errors.lastname}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastname}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                isInvalid={!!errors.role}
                            >
                                <option value="PLAYER">Player</option>
                                <option value="LEAGUE_PROVIDER">League Provider</option>
                            </Form.Control>
                        </Form.Group>

                        {errors.apiError && (
                            <div className="text-danger mt-3">
                                {errors.apiError}
                            </div>
                        )}

                        <Button variant="danger" type="submit" className="w-100 mt-4">
                            Sign Up
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
