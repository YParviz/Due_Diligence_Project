import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/documents.css';

const Documents = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { company } = location.state || {};
    const [document, setDocument] = useState(null);
    const [documentStatus, setDocumentStatus] = useState('');

    useEffect(() => {
        if (company) {
            // Fetch the document status if needed
            axios.get(`http://localhost:8000/api/companies/${company.id}/document-status/`)
                .then(response => setDocumentStatus(response.data.status))
                .catch(error => console.error('Error fetching document status:', error));
        }
    }, [company]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setDocument(selectedFile);
        } else {
            alert('Veuillez télécharger uniquement des fichiers PDF.');
            setDocument(null);
        }
    };

    const handleUpload = () => {
        if (document && company) {
            const formData = new FormData();
            formData.append('document', document);
            formData.append('company_id', company.id);

            axios.post('http://localhost:8000/api/companies/upload-document/', formData)
                .then(response => {
                    console.log('Document uploaded successfully');
                    setDocumentStatus('Uploaded');
                    navigate(`/analysis/${company.id}`, { state: { company } }); // Pass the company data to analysis page
                })
                .catch(error => console.error('Error uploading document:', error));
        }
    };

    const handleBackClick = () => {
        navigate('/home');  // Redirection vers la page Home
    };

    return (
        <div className="documents-container">
            <h1 className="title">Documents</h1>
            <div className="form-container">
                <div className="form-group">
                    <label>Company name:</label>
                    <div className="form-input">{company?.name}</div>
                </div>
                <div className="form-group">
                    <label>Document Status:</label>
                    <div className="form-input">{documentStatus}</div>
                </div>
                <div className="form-group">
                    <label>Upload Document:</label>
                    <input type="file" onChange={handleFileChange} accept=".pdf" />
                </div>
                <div className="actions">
                    <button className="upload-btn" onClick={handleUpload} disabled={!document}>
                        Upload
                    </button>
                    <button className="back-btn" onClick={handleBackClick}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default Documents;
