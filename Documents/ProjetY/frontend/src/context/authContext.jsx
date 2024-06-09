import React, { createContext, useContext, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('There is no AuthProvider');
    return context;
}

const client = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

function getAuthToken() {
    return localStorage.getItem('token');
}

client.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        logged: false,
        data: [],
    });

    const login = async (data) => {
        setLoading(true);
        try {
            const response = await client.post('login/', data);
            const userData = response.data;
            const token = userData.token;
            localStorage.setItem('token', token);
            setUser({ logged: true, data: userData });
            return userData;  // Ensure that the user data is returned
        } catch (err) {
            console.error('Login error:', err);
            throw new Error('Login failed');
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        if (!user.logged) return console.log("User is not logged");
        setLoading(true);
        try {
            await client.post('logout/');
            localStorage.removeItem('token');
            setUser({ logged: false, data: [] });
        } catch (err) {
            console.error(err);
            throw new Error('Logout failed');
        } finally {
            setLoading(false);
        }
    }

    const signup = async (data) => {
        setLoading(true);
        try {
            const res = await client.post('register/', data);
            return res.data;
        } catch (err) {
            console.error(err);
            throw new Error('Signup failed');
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async (email) => {
        setLoading(true);
        try {
            const res = await client.post('/reset-password', { email });
            return res.data;
        } catch (err) {
            console.error(err);
            throw new Error('An error occurred while resetting the password');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async () => {
        setLoading(true);
        try {
            await client.delete('delete-user/');
            setUser({ logged: false, data: [] });
        } catch (err) {
            console.error(err);
            throw new Error('Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const contextValue = { login, logout, user, setUser, signup, resetPassword, deleteUser, loading };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider> 
    );
}
