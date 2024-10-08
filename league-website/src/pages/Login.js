import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { auth, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Redirect if already logged in
        if (auth.token && auth.role) {
            if (auth.role === 'ADMIN') {
                navigate('/admin-home', { replace: true });
            } else if (auth.role === 'PLAYER') {
                navigate('/', { replace: true });
            } else if (auth.role === 'LEAGUE_PROVIDER') {
                navigate('/league-provider-home', { replace: true });
            }
        }
    }, [auth, navigate]);

    const validate = () => {
        let formErrors = {};
        let valid = true;

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
                const response = await axios.post('http://localhost:8080/auth/signin', formData);
                const token = response.data.jwt || response.data.token;

                if (!token) {
                    throw new Error("No token found in response");
                }

                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken = JSON.parse(window.atob(base64));

                const roles = decodedToken.authorities || [];
                const username = decodedToken.sub;
                const userId = decodedToken.userId; // Assuming userId is included in the token

                if (roles.length === 0) {
                    throw new Error("No roles found in token");
                }

                // Map the role to full names
                let role = roles[0];
                switch (role) {
                    case 'P':
                        role = 'PLAYER';
                        break;
                    case 'A':
                        role = 'ADMIN';
                        break;
                    case 'L':
                        role = 'LEAGUE_PROVIDER';
                        break;
                    default:
                        console.warn(`Unknown role: ${role}`);
                        setErrors({ apiError: 'Unknown role' });
                        return;
                }

                // Store token and userId in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);

                // Use login function from context, pass navigate here
                login(token, username, role, navigate);

            } catch (error) {
                console.error('Login error:', error);
                setErrors({ ...errors, apiError: 'Invalid email or password' });
            }
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Login</h2>
                    <Form onSubmit={handleSubmit}>
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

                        <Form.Group controlId="formPassword" className="mt-3">
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

                        {errors.apiError && (
                            <div className="text-danger mt-3">
                                {errors.apiError}
                            </div>
                        )}

                        <Button variant="danger" type="submit" className="w-100 mt-4">
                            Login
                        </Button>

                        <div className="text-center mt-3">
                            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
