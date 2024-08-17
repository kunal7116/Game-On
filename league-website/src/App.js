// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavigationBar from './components/Navbar';  // User navbar
import AdminNavbar from './components/AdminNavbar';  // Admin navbar
import LeagueProviderNavbar from './components/LeagueProviderNavbar'; // League Provider navbar
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
import AdminHomePage from './pages/AdminHomePage';
import AddCityPage from './pages/AddCityPage';
import AddSportsPage from './pages/AddSportsPage';
// import AddLeaguePage from './pages/AddLeaguePage';
import ManageMatchesPage from './pages/ManageMatchesPage';
import ManageMatchResultsPage from './pages/ManageMatchResultsPage';
import ManageRegisterTeamPage from './pages/ManageRegisterTeamPage'; // Import new page
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentPage from './components/PaymentPage.js';
import ManageLeaguesPage from './pages/ManageLeaguesPage.js';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </Router>
  );
}

function Main() {
  const location = useLocation();

  // Determine which navbar to display based on the current path
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLeagueProviderRoute = location.pathname.startsWith('/league-provider');

  return (
    <div>
      {isAdminRoute ? (
        <AdminNavbar />
      ) : isLeagueProviderRoute ? (
        <LeagueProviderNavbar />
      ) : (
        <NavigationBar />
      )}
      <Routes>
        <Route path="/" element={<ProtectedRoute role="PLAYER"><HomePage /></ProtectedRoute>} />
        <Route path="/city" element={<ProtectedRoute role="PLAYER"><CityPage /></ProtectedRoute>} />
        <Route path="/sports/:cityId" element={<ProtectedRoute role="PLAYER"><SportsPage /></ProtectedRoute>} />
        <Route path="/leagues/:sportId" element={<ProtectedRoute role="PLAYER"><LeaguesPage /></ProtectedRoute>} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/register/:sportId/:leagueId" element={<ProtectedRoute role="PLAYER"><RegistrationForm /></ProtectedRoute>} />
        <Route path="/register/:leagueId" element={<ProtectedRoute role="PLAYER"><RegistrationForm /></ProtectedRoute>} />
        <Route path="/league-provider-home" element={<ProtectedRoute role="LEAGUE_PROVIDER"><LeagueProviderHomePage /></ProtectedRoute>} />
        <Route path="/league-provider/manage-leagues" element={<ProtectedRoute role="LEAGUE_PROVIDER"><ManageLeaguesPage /></ProtectedRoute>} />
        <Route path="/admin-home" element={<ProtectedRoute role="ADMIN"><AdminHomePage /></ProtectedRoute>} />
        <Route path="/admin/add-city" element={<ProtectedRoute role="ADMIN"><AddCityPage /></ProtectedRoute>} />
        <Route path="/admin/add-sports" element={<ProtectedRoute role="ADMIN"><AddSportsPage /></ProtectedRoute>} />
        {/* <Route path="/admin/add-league" element={<ProtectedRoute role="ADMIN"><AddLeaguePage /></ProtectedRoute>} /> */}
        <Route path="/admin/manage-matches" element={<ProtectedRoute role="ADMIN"><ManageMatchesPage /></ProtectedRoute>} />
        <Route path="/admin/manage-match-results" element={<ProtectedRoute role="ADMIN"><ManageMatchResultsPage /></ProtectedRoute>} />
        <Route path="/admin/manage-register-team" element={<ProtectedRoute role="ADMIN"><ManageRegisterTeamPage /></ProtectedRoute>} />
        <Route path="/payment/:leagueId" element={<ProtectedRoute role="PLAYER"><PaymentPage /></ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
