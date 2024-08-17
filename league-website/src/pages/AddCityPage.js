import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Container } from 'react-bootstrap';
import axios from 'axios';
import '../assets/styles/AddCityPage.css';

const AddCityPage = () => {
    const [cities, setCities] = useState([]);
    const [show, setShow] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);
    const [cityName, setCityName] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/cities');
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:8080/api/cities', { cityName });
            fetchCities();
            setShow(false);
        } catch (error) {
            console.error("Error adding city", error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/cities/${currentCity.cityId}`, { cityName });
            fetchCities();
            setShow(false);
        } catch (error) {
            console.error("Error updating city", error);
        }
    };

    const handleDelete = async (cityId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cities/${cityId}`);
            fetchCities();
        } catch (error) {
            console.error("Error deleting city", error);
        }
    };

    const openModal = (city = null) => {
        setCurrentCity(city);
        setCityName(city ? city.cityName : '');
        setShow(true);
    };

    return (
        <Container className="my-4">
            <Button variant="primary" onClick={() => openModal()}>Add City</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>City Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map(city => (
                        <tr key={city.cityId}>
                            <td>{city.cityId}</td>
                            <td>{city.cityName}</td>
                            <td>
                                <Button variant="warning" onClick={() => openModal(city)}>Edit</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleDelete(city.cityId)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentCity ? 'Update City' : 'Add City'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formCityName">
                            <Form.Label>City Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city name"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    {currentCity ? (
                        <Button variant="primary" onClick={handleUpdate}>Update</Button>
                    ) : (
                        <Button variant="primary" onClick={handleAdd}>Add</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AddCityPage;
