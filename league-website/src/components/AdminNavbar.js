// src/components/AdminNavbar.js
import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/AdminNavbar.css';

function AdminNavbar() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear data from local storage and navigate to the login page
        localStorage.removeItem('auth'); // Assuming 'auth' is the key for storing user data
        logout(() => navigate('/login'));
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/admin-home">Gameon Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/admin/add-city">Add City</Nav.Link>
                        <Nav.Link as={Link} to="/admin/add-sports">Add Sports</Nav.Link>
                        <Nav.Link as={Link} to="/admin/add-league">Add League</Nav.Link>
                        <Nav.Link as={Link} to="/admin/manage-matches">Manage Matches</Nav.Link>
                        <Nav.Link as={Link} to="/admin/manage-match-results">Manage Match Results</Nav.Link>
                        <Nav.Link as={Link} to="/admin/manage-register-team">Manage Registered Teams</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={auth.user || "Admin"} id="admin-nav-dropdown">
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavbar;
