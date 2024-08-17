import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const ManageMatchesPage = () => {
    const [leagues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState('');
    const [selectedTeam1Id, setSelectedTeam1Id] = useState('');
    const [selectedTeam2Id, setSelectedTeam2Id] = useState('');
    const [matchDate, setMatchDate] = useState('');
    const [matchTime, setMatchTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/leagues')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setLeagues(data);
                } else {
                    console.error('Failed to fetch leagues:', data);
                    setErrorMessage('Failed to fetch leagues.');
                }
            })
            .catch(error => {
                console.error('Error fetching leagues:', error);
                setErrorMessage('Error fetching leagues.');
            });
    }, []);

    useEffect(() => {
        if (selectedLeagueId) {
            const endpoint = `http://localhost:8080/api/registered-teams/${selectedLeagueId}/teams`;
            fetch(endpoint)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error: ${res.statusText} (Status: ${res.status})`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setTeams(data);
                    } else {
                        console.error('Failed to fetch teams:', data);
                        setErrorMessage('Failed to fetch teams.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                    setErrorMessage(error.message);
                });
        }
    }, [selectedLeagueId]);

    const validateTeamIds = () => {
        if (!Array.isArray(teams)) {
            console.error('Teams is not an array');
            return false;
        }

        // Parse the input IDs as integers for comparison
        const team1IdInt = parseInt(selectedTeam1Id, 10);
        const team2IdInt = parseInt(selectedTeam2Id, 10);

        // Log fetched team IDs for debugging
        console.log('Available teams:', teams.map(team => team.teamId));

        const validTeam1 = teams.some(team => team.teamId === team1IdInt);
        const validTeam2 = teams.some(team => team.teamId === team2IdInt);

        if (!validTeam1 || !validTeam2) {
            setErrorMessage('One or both of the team IDs are invalid. Please check the team list and try again.');
            return false;
        }

        setErrorMessage('');
        return true;
    };

    const handleSubmit = () => {
        if (!validateTeamIds()) {
            return;
        }

        const matchData = {
            leagueId: selectedLeagueId,
            team1Id: selectedTeam1Id,
            team2Id: selectedTeam2Id,
            matchDate,
            matchTime,
        };

        fetch('http://localhost:8080/api/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matchData),
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.matchId) {
                    console.log('Match created successfully:', data);
                } else {
                    console.error('Failed to create match:', data);
                    setErrorMessage('Failed to create match.');
                }
            })
            .catch(error => {
                console.error('Error creating match:', error);
                setErrorMessage('Error creating match.');
            });
    };

    return (
        <Container className="my-5">
            <h2>Manage Matches</h2>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Enter League ID</Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            value={selectedLeagueId}
                            onChange={(e) => setSelectedLeagueId(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Enter Team 1 ID</Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            value={selectedTeam1Id}
                            onChange={(e) => setSelectedTeam1Id(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Enter Team 2 ID</Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            value={selectedTeam2Id}
                            onChange={(e) => setSelectedTeam2Id(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Match Date</Form.Label>
                    <Col sm="10">
                        <Form.Control type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Match Time</Form.Label>
                    <Col sm="10">
                        <Form.Control type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} />
                    </Col>
                </Form.Group>

                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                <Button variant="primary" onClick={handleSubmit}>Start Match</Button>
            </Form>
        </Container>
    );
};

export default ManageMatchesPage;
