// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        user: localStorage.getItem('username'),
        role: localStorage.getItem('role'),
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token) {
            // Set token in header or other related actions if necessary
        }
    }, [auth.token]);

    const login = (token, user, role) => {
        setAuth({ token, user, role });
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);
        localStorage.setItem('role', role);

        if (role === 'ADMIN') {
            navigate('/admin-home', { replace: true });
        } else if (role === 'PLAYER') {
            navigate('/', { replace: true });
        } else if (role === 'LEAGUE_PROVIDER') {
            navigate('/league-provider-home', { replace: true });
        } else {
            console.warn(`Unknown role: ${role}`);
            navigate('/login', { replace: true });
        }
    };

    const logout = () => {
        setAuth({ token: null, user: null, role: null });
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        // Remove token from header or other related actions if necessary
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
