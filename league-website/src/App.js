import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import SportsPage from './pages/SportsPage';
import LeaguesPage from './pages/LeaguesPage';
import AboutUsPage from './pages/AboutUsPage';
import RegistrationForm from './components/RegistrationForm';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LeagueProviderHomePage from './pages/LeagueProviderHomePage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/city" element={<CityPage />} />
          <Route path="/sports/:cityId" element={<SportsPage />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/register/:leagueId" element={<RegistrationForm />} />
          <Route path="/league-provider-home" element={<LeagueProviderHomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
