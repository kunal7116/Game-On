// src/components/NavigationBar.js
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/Navbar.css';

function NavigationBar() {
    const { auth, logout } = useAuth();
    const [username, setUsername] = useState(auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        // Update the username whenever the auth state changes
        setUsername(auth.user);
    }, [auth.user]);

    const handleLogout = () => {
        logout(navigate); // Use the logout function from AuthContext
    };

    return (
        <Navbar bg="light" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/">League Website</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/city">League Page</Nav.Link>
                        <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
                    </Nav>
                    <Nav>
                        {username ? (
                            <NavDropdown title={username} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <NavDropdown title="Account" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/signup">Sign Up</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
