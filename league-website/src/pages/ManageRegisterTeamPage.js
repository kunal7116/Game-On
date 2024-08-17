// src/pages/ManageRegisterTeamPage.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import '../assets/styles/ManageRegisterTeamPage.css'

const ManageRegisterTeamPage = () => {
    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [updatedTeamName, setUpdatedTeamName] = useState('');

    useEffect(() => {
        // Fetch all registered teams
        axios.get('http://localhost:8080/api/registered-teams')
            .then(response => setTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    const handleShowModal = (team) => {
        setSelectedTeam(team);
        setUpdatedTeamName(team.teamName);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTeam(null);
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8080/api/registered-teams/${selectedTeam.teamId}`, {
            ...selectedTeam,
            teamName: updatedTeamName
        })
            .then(response => {
                setTeams(teams.map(team => team.teamId === response.data.teamId ? response.data : team));
                handleCloseModal();
            })
            .catch(error => console.error('Error updating team:', error));
    };

    const handleDelete = (teamId) => {
        axios.delete(`http://localhost:8080/api/registered-teams/${teamId}`)
            .then(() => {
                setTeams(teams.filter(team => team.teamId !== teamId));
            })
            .catch(error => console.error('Error deleting team:', error));
    };

    return (
        <Container className="my-5">
            <h2>Manage Registered Teams</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Team Name</th>
                        <th>League</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map(team => (
                        <tr key={team.teamId}>
                            <td>{team.teamId}</td>
                            <td>{team.teamName}</td>
                            <td>{team.leagueId}</td>
                            <td>
                                <Button variant="warning" className="me-2" onClick={() => handleShowModal(team)}>Update</Button>
                                <Button variant="danger" onClick={() => handleDelete(team.teamId)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Team Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTeamName">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedTeamName}
                                onChange={(e) => setUpdatedTeamName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ManageRegisterTeamPage;
