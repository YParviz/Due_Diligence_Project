// CreateCompany.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/createCompany.css';

const CreateCompany = () => {
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateCompany = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/create-company/', { company: companyName });
            if (response.status === 201) {
                navigate('/home');  // Redirection après la création réussie
            }
        } catch (error) {
            setError('Failed to create company');
            console.error('Error creating company:', error);
        }
    };

    return (
        <div className="create-company-container">
            <h1>New Company</h1>
            <div className="form-group">
                <label htmlFor="company-name">Company name :</label>
                <input
                    type="text"
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                {error && <div className="error">{error}</div>}
                <button onClick={handleCreateCompany}>Create</button>
            </div>
        </div>
    );
};

export default CreateCompany;
