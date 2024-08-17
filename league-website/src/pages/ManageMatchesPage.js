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
                }
            })
            .catch(error => console.error('Error fetching leagues:', error));
    }, []);

    useEffect(() => {
        if (selectedLeagueId) {
            fetch(`http://localhost:8080/${selectedLeagueId}/teams`)
                .then(res => {
                    if (res.status === 404) {
                        throw new Error('Teams not found for this league.');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Fetched teams:', data);
                    if (Array.isArray(data)) {
                        setTeams(data);
                    } else {
                        console.error('Failed to fetch teams:', data);
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

        console.log('Teams:', teams);

        const validTeam1 = teams.some(team => team.teamId === selectedTeam1Id);
        const validTeam2 = teams.some(team => team.teamId === selectedTeam2Id);

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
                }
            })
            .catch(error => console.error('Error creating match:', error));
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
