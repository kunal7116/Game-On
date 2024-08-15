import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/CityPage.css';

function CityPage() {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);

    useEffect(() => {
        // Fetch cities from backend
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cities');
                console.log(response.data);
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleCityClick = (cityId) => {
        navigate(`/sports/${cityId}`);
    };

    return (
        <Container className="city-page">
            <h2>Select Your City</h2>
            <p>Select a city to proceed to the sports selection page.</p>
            <Row>
                {cities.map((city) => (
                    <Col
                        key={city.cityId}
                        xs={6}
                        sm={4}
                        md={2}
                        className="city-box"
                        onClick={() => handleCityClick(city.cityId)}
                        style={{ cursor: 'pointer' }}
                    >
                        {city.cityName}
                    </Col>
                ))}

            </Row>
        </Container>
    );
}

export default CityPage;
