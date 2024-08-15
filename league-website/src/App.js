import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // Player's HomePage
import CityPage from './pages/CityPage';
import SportsPage from './pages/SportsPage';
import LeaguesPage from './pages/LeaguesPage';
import AboutUsPage from './pages/AboutUsPage';
import RegistrationForm from './components/RegistrationForm';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LeagueProviderHomePage from './pages/LeagueProviderHomePage';
// import AdminHomePage from './pages/AdminHomePage'; // Assuming you have an AdminHomePage component
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoute role="PLAYER"><HomePage /></ProtectedRoute>} />
            <Route path="/city" element={<ProtectedRoute role="PLAYER"><CityPage /></ProtectedRoute>} />
            <Route path="/sports/:cityId" element={<ProtectedRoute role="PLAYER"><SportsPage /></ProtectedRoute>} />
            <Route path="/leagues/:sportId" element={<ProtectedRoute role="PLAYER"><LeaguesPage /></ProtectedRoute>} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/register" element={<ProtectedRoute role="PLAYER"><RegistrationForm /></ProtectedRoute>} />
            <Route path="/register/:leagueId" element={<ProtectedRoute role="PLAYER"><RegistrationForm /></ProtectedRoute>} />
            <Route path="/league-provider-home" element={<ProtectedRoute role="LEAGUE_PROVIDER"><LeagueProviderHomePage /></ProtectedRoute>} />
            {/* <Route path="/admin-home" element={<ProtectedRoute role="ADMIN"><AdminHomePage /></ProtectedRoute>} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
