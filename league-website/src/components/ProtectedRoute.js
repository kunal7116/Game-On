import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { auth } = useAuth();

    console.log("ProtectedRoute:", auth);

    if (!auth.token) {
        return <Navigate to="/login" replace />;
    }

    if (auth.role !== role) {
        console.warn(`Role mismatch: expected ${role}, got ${auth.role}`);

        switch (auth.role) {
            case 'ADMIN':
                return <Navigate to="/admin-home" replace />;
            case 'LEAGUE_PROVIDER':
                return <Navigate to="/league-provider-home" replace />;
            case 'PLAYER':
                return <Navigate to="/" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
