import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/analysis.css';  // Assurez-vous de créer ce fichier CSS

const Analysis = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/companies/${id}/`)
            .then(response => setCompany(response.data))
            .catch(error => console.error('Error fetching company data:', error));
    }, [id]);

    const handleUpdateClick = () => {
        navigate(`/documents`, { state: { company } });
    };

    const handleBackClick = () => {
        navigate('/');
    };

    if (!company) return <div>Loading...</div>;

    return (
        <div className="analysis-container">
            <h1 className="title">Analysis</h1>
            <div className="analysis-details">
                <div className="detail-item">
                    <label>Company name: </label>
                    <span>{company.name}</span>
                </div>
                <div className="detail-item">
                    <label>Address: </label>
                    <span>{company.address}</span>
                </div>
                <div className="detail-item">
                    <label>Score: </label>
                    <span>{company.score}</span>
                </div>
                <div className="detail-item">
                    <label>Accuracy: </label>
                    <span>{company.accuracy}</span>
                </div>
                <div className="detail-item">
                    <label>Risk: </label>
                    <span>{company.risk}</span>
                </div>
                <div className="detail-item">
                    <label>Analysis summary: </label>
                    <span>{company.summary}</span>
                </div>
            </div>
            <div className="buttons">
                <button className="update-btn" onClick={handleUpdateClick}>Update the analysis</button>
                <button className="back-btn" onClick={handleBackClick}>Back</button>
            </div>
        </div>
    );
};

export default Analysis;
