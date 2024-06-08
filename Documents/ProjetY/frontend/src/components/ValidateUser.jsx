import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/validateUser.css'; // Assurez-vous de créer et d'importer le fichier CSS

function ValidateUser() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [username, setUsername] = useState('');
    const [validationStatus, setValidationStatus] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(`http://localhost:8000/api/user-details/${userId}/`);
                const userData = response.data;
                setCompanyName(userData.company);
                setUsername(userData.username);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, [userId]);

    const handleValidation = async (isValidated) => {
        try {
            if (userId) {
                const response = await axios.patch(`http://127.0.0.1:8000/api/validate/${userId}/`, { is_validated: isValidated });
                if (isValidated) {
                    setValidationStatus('Accepted');
                    console.log('User accepted successfully');
                    navigate('/users');  // Redirection après l'acceptation
                } else {
                    const deleteResponse = await axios.delete(`http://127.0.0.1:8000/api/validate/${userId}/`);
                    console.log('User deleted successfully');
                    navigate('/users');  // Redirection après le rejet
                }
            } else {
                console.error('Error: userId is undefined');
            }
        } catch (error) {
            console.error('Error updating validation status:', error);
        }
    };

    return (
        <div className="validation-container">
            <h1 className="title">New request</h1>
            <div className="form-container">
                <div className="form-group">
                    <label>Company Name:</label>
                    <div className="form-input">{companyName}</div>
                </div>
                <div className="form-group">
                    <label>Username:</label>
                    <div className="form-input">{username}</div>
                </div>
                <div className="button-container">
                    <button className="accept-button" onClick={() => handleValidation(true)}>Accept</button>
                    <button className="reject-button" onClick={() => handleValidation(false)}>Reject</button>
                </div>
            </div>
        </div>
    );
}

export default ValidateUser;
