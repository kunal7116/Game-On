import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import '../assets/styles/AddLeaguePage.css'; // Make sure you have appropriate styling

const AddLeaguePage = () => {
    const [cities, setCities] = useState([]);
    const [sports, setSports] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState('');
    const [selectedSportId, setSelectedSportId] = useState('');
    const [leagueData, setLeagueData] = useState({
        leagueName: '',
        prizeMoney: '',
        startDate: '',
        endDate: '',
        rules: '',
        entryFee: '',
    });
    const [selectedLeagueId, setSelectedLeagueId] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCityId) {
            fetchSports(selectedCityId);
        }
    }, [selectedCityId]);

    useEffect(() => {
        if (selectedSportId) {
            fetchLeagues(selectedSportId);
        }
    }, [selectedSportId]);

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchSports = async (cityId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/sports/city/${cityId}`);
            setSports(response.data);
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    };

    const fetchLeagues = async (sportId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/leagues/sport/${sportId}`);
            setLeagues(response.data);
        } catch (error) {
            console.error('Error fetching leagues:', error);
        }
    };

    const handleAddLeague = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/leagues', {
                ...leagueData,
                sportsId: selectedSportId,
                cityId: selectedCityId,
            });
            fetchLeagues(selectedSportId); // Refresh the leagues list
        } catch (error) {
            console.error('Error adding league:', error);
        }
    };

    const handleUpdateLeague = async () => {
        if (!selectedLeagueId) {
            alert('Please select a league to update.');
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/leagues/${selectedLeagueId}`, {
                ...leagueData,
                sportsId: selectedSportId,
                cityId: selectedCityId,
            });
            fetchLeagues(selectedSportId); // Refresh the leagues list
        } catch (error) {
            console.error('Error updating league:', error);
        }
    };

    const handleDeleteLeague = async (leagueId) => {
        try {
            await axios.delete(`http://localhost:8080/api/leagues/${leagueId}`);
            fetchLeagues(selectedSportId); // Refresh the leagues list
        } catch (error) {
            console.error('Error deleting league:', error);
        }
    };

    const handleLeagueClick = (league) => {
        setSelectedLeagueId(league.leagueId);
        setLeagueData({
            leagueName: league.leagueName,
            prizeMoney: league.prizeMoney,
            startDate: league.startDate,
            endDate: league.endDate,
            rules: league.rules,
            entryFee: league.entryFee,
        });
    };

    return (
        <div className="add-league-page">
            <h2>Add or Manage Leagues</h2>
            <Form onSubmit={handleAddLeague} className="mb-4">
                <Form.Group controlId="formCityId">
                    <Form.Label>City ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter city ID"
                        value={selectedCityId}
                        onChange={(e) => setSelectedCityId(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formSportId">
                    <Form.Label>Sport ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter sport ID"
                        value={selectedSportId}
                        onChange={(e) => setSelectedSportId(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formLeagueName">
                    <Form.Label>League Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter league name"
                        value={leagueData.leagueName}
                        onChange={(e) => setLeagueData({ ...leagueData, leagueName: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formPrizeMoney">
                    <Form.Label>Prize Money</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter prize money"
                        value={leagueData.prizeMoney}
                        onChange={(e) => setLeagueData({ ...leagueData, prizeMoney: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={leagueData.startDate}
                        onChange={(e) => setLeagueData({ ...leagueData, startDate: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={leagueData.endDate}
                        onChange={(e) => setLeagueData({ ...leagueData, endDate: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formRules">
                    <Form.Label>Rules</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={leagueData.rules}
                        onChange={(e) => setLeagueData({ ...leagueData, rules: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formEntryFee">
                    <Form.Label>Entry Fee</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter entry fee"
                        value={leagueData.entryFee}
                        onChange={(e) => setLeagueData({ ...leagueData, entryFee: e.target.value })}
                    />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">Add League</Button>
                <Button variant="warning" onClick={handleUpdateLeague} className="ms-2">Update League</Button>
            </Form>
            <h3>Existing Leagues</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Prize Money</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Rules</th>
                        <th>Entry Fee</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leagues.map(league => (
                        <tr key={league.leagueId} onClick={() => handleLeagueClick(league)}>
                            <td>{league.leagueId}</td>
                            <td>{league.leagueName}</td>
                            <td>{league.prizeMoney}</td>
                            <td>{league.startDate}</td>
                            <td>{league.endDate}</td>
                            <td>{league.rules}</td>
                            <td>{league.entryFee}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteLeague(league.leagueId)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AddLeaguePage;
