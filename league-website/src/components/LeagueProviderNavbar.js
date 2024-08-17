import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/LeagueProviderNavbar.css';

function LeagueProviderNavbar() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear data from local storage and navigate to the login page
        localStorage.removeItem('auth'); // Assuming 'auth' is the key for storing user data
        logout(() => navigate('/login'));
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="leagueprovider-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/league-provider-home">Gameon League Provider</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/league-provider/manage-leagues">Manage Leagues</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={auth.user || "League Provider"} id="leagueprovider-nav-dropdown">
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default LeagueProviderNavbar;
