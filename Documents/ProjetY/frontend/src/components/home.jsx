// home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import './styles/home.css';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Utilisez useNavigate pour la navigation

    useEffect(() => {
        // Vous pouvez ajouter ici d'autres logiques d'initialisation si nécessaire
    }, []);

    const handleDownloadClick = () => {
        // Logique pour vérifier si les documents peuvent être téléchargés
        // Ensuite, redirigez vers la page de téléchargement des documents
        navigate('/documents'); // Redirige vers la page de téléchargement des documents
    };

    return (
        <div className="home-container">
            <h1>Customer</h1>
            <div className="company-section">
                <label htmlFor="company-search">Search for a company</label>
                <input type="text" id="company-search" placeholder="Company" />
                <button className="create-company-btn">Create new company</button>
            </div>
            <div className="company-table">
                <table>
                    <thead>
                        <tr>
                            <th>Company name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Vous pouvez remplir ici les données des entreprises si vous les avez déjà */}
                        {/* Par exemple : */}
                        {/* <tr>
                            <td>Example Company</td>
                            <td>Downloaded</td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
            <button className="download-btn" onClick={handleDownloadClick}>Download the documents</button>
        </div>
    );
};

export default Home;
