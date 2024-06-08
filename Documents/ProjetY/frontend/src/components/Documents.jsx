import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/documents.css'; // Assurez-vous de créer et d'importer le fichier CSS
import searchIcon from '../images/search.jpg';
import loadingIcon from '../images/loading.jpg';
import downloadIcon from '../images/download.jpg'; // Suppose you have a download.jpg

const Documents = () => {
    const [companyName, setCompanyName] = useState('');
    const [documentStatus, setDocumentStatus] = useState('');

    useEffect(() => {
        async function fetchCompanyData() {
            try {
                // Remplacez l'URL par l'URL appropriée pour obtenir les données de l'entreprise
                const response = await axios.get('http://localhost:8000/api/company-details/');
                const companyData = response.data;
                setCompanyName(companyData.name);
                setDocumentStatus(companyData.documentStatus);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        }
        fetchCompanyData();
    }, []);

    const handleDownload = () => {
        // Logique pour télécharger les documents
        console.log('Downloading documents...');
    };

    return (
        <div className="documents-container">
            <h1 className="title">Documents</h1>
            <div className="form-container">
                <div className="form-group">
                    <label>Company name:</label>
                    <div className="form-input">{companyName}</div>
                </div>
                <div className="form-group">
                    <label>Document status:</label>
                    <div className="form-input">{documentStatus}</div>
                </div>
                <div className="actions">
                    <img src={searchIcon} alt="Search" className="icon" />
                    <img src={loadingIcon} alt="Loading" className="icon" />
                    <button className="download-btn" onClick={handleDownload}>
                        <img src={downloadIcon} alt="Download" className="icon" /> Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Documents;
