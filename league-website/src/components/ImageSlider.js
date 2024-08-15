import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../assets/styles/ImageSlider.css';
import bgImage1 from '../assets/images/BG-IMAGE2.jpg';
import bgImage2 from '../assets/images/BG-IMAGE4.jpg';
import bgImage3 from '../assets/images/BG-IMAGE5.jpg';

function ImageSlider() {
    return (
        <div className="slider-container">
            <div className="fixed-caption">
                <h1 className="website-title">GAME ON</h1>
                <p className="website-description">Experience the thrill of the league!</p>
            </div>
            <Carousel className="custom-carousel" interval={3000} controls={true} indicators={true} pause={false}>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={bgImage1}
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={bgImage2}
                        alt="Second slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={bgImage3}
                        alt="Second slide"
                    />
                </Carousel.Item>
                {/* Add more Carousel.Item components as needed */}
            </Carousel>
        </div>
    );
}

export default ImageSlider;
