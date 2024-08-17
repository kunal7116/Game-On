import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../assets/styles/AddSportsPage.css';

const AddSportsPage = () => {
    const [cityId, setCityId] = useState('');
    const [sports, setSports] = useState([]);
    const [sportTypes, setSportTypes] = useState([]);
    const [selectedSportType, setSelectedSportType] = useState('');
    const [sportId, setSportId] = useState(null);

    useEffect(() => {
        if (cityId) {
            fetchSportsByCityId(cityId);
        }
    }, [cityId]);

    useEffect(() => {
        fetchSportTypes();
    }, []);

    const fetchSportsByCityId = async (cityId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/sports/city/${cityId}`);
            setSports(response.data);
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    };

    const fetchSportTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/sports/types');
            setSportTypes(response.data);
        } catch (error) {
            console.error('Error fetching sport types:', error);
        }
    };

    const handleAddSport = async () => {
        try {
            await axios.post('http://localhost:8080/api/sports', {
                sportType: selectedSportType,
                cityId: cityId
            });
            fetchSportsByCityId(cityId); // Refresh the sports list
        } catch (error) {
            console.error('Error adding sport:', error);
        }
    };

    const handleDeleteSport = async (sportsId) => {
        try {
            await axios.delete(`http://localhost:8080/api/sports/${sportsId}`);
            fetchSportsByCityId(cityId); // Refresh the sports list
        } catch (error) {
            console.error('Error deleting sport:', error);
        }
    };

    return (
        <div className="add-sports-page text-center my-5">
            <h2>Add Sports</h2>
            <Form.Group controlId="formCityId">
                <Form.Label>Select City ID</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter City ID"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formSportType">
                <Form.Label>Sport Type</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedSportType}
                    onChange={(e) => setSelectedSportType(e.target.value)}
                >
                    <option value="">Select Sport Type</option>
                    {sportTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <br />
            <Button variant="primary" onClick={handleAddSport}>Add Sport</Button>

            {sports.length > 0 && (
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sports.map(sport => (
                            <tr key={sport.sportsId}>
                                <td>{sport.sportsId}</td>
                                <td>{sport.sportType}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteSport(sport.sportsId)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default AddSportsPage;
