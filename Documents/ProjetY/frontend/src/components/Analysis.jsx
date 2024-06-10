import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/analysis.css';

const Analysis = () => {
    const { id } = useParams();
    const location = useLocation();
    const [analysis, setAnalysis] = useState(null);
    const navigate = useNavigate();
    const company = location.state?.company;

    useEffect(() => {
        axios.get(`http://localhost:8000/api/companies/${id}/analysis/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => setAnalysis(response.data))
        .catch(error => console.error('Error fetching analysis data:', error));
    }, [id]);

    const handleUpdateClick = () => {
        if (company) {
            navigate(`/documents`, { state: { company } });
        } else {
            console.error('Company data not available');
        }
    };

    const handleBackClick = () => {
        navigate('/home');
    };

    if (!analysis) return <div>Loading...</div>;

    return (
        <div className="analysis-container">
            <h1 className="title">Analysis</h1>
            <div className="analysis-details">
                <div className="detail-item">
                    <label>Company name: </label>
                    <span>{company?.name || 'Company name not available'}</span>
                </div>
                <div className="detail-item">
                    <label>Address: </label>
                    <span>{company?.address || 'Address not available'}</span>
                </div>
                <div className="detail-item">
                    <label>Score: </label>
                    <span>{analysis.score}</span>
                </div>
                <div className="detail-item">
                    <label>Accuracy: </label>
                    <span>{analysis.accuracy}</span>
                </div>
                <div className="detail-item">
                    <label>Risk: </label>
                    <span>{analysis.risk}</span>
                </div>
                <div className="detail-item">
                    <label>Analysis summary: </label>
                    <span>{analysis.summary}</span>
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
