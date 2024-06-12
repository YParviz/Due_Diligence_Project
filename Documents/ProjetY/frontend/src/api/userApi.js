// userApi.js
import api from './axiosConfig';

export async function getUsers() {
    try {
        const response = await api.get('users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response || error.message || error);
        throw new Error('Failed to fetch users');
    }
}

export async function updateUser(userId, updatedData) {
    try {
        const response = await api.patch(`users/${userId}/`, updatedData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update user with ID ${userId}`);
    }
}

export async function getUserById(userId) {
    try {
        const response = await api.get(`users/${userId}/`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch user with ID ${userId}`);
    }
}

export async function registerUser(userData) {
    try {
        const response = await api.post('register/', userData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to register user');
    }
}

export async function loginUser(username, password) {
    try {
        const response = await api.post('login/', {
            username: username,
            password: password
        });
        const token = response.data.token;
        localStorage.setItem('token', token);
        // Ajoutez le token dans les en-têtes de l'API axios
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        return token;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Invalid username or password');
    }
}
