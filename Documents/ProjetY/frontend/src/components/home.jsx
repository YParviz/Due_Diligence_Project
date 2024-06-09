// components/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/home.css';
import { useAuth } from '../context/authContext';

const Home = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user.logged) {
            navigate('/login');
        } else {
            axios
                .get("http://localhost:8000/api/companies/")
                .then((response) => setCompanies(response.data))
                .catch((error) => console.error("Error fetching companies:", error));
        }
    }, [user, navigate]);

    const handleCreateCompanyClick = () => {
        navigate("/create-company");
    };

    const deleteCompany = (id) => {
        axios
            .delete(`http://localhost:8000/api/companies/${id}/delete/`)
            .then(() =>
                setCompanies(companies.filter((company) => company.id !== id))
            )
            .catch((error) => console.error("Error deleting company:", error));
    };

    const viewCompany = (id) => {
        navigate(`/analysis/${id}`);
    };

    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
    };

    const handleDownloadDocumentsClick = () => {
        if (selectedCompany) {
            navigate(`/documents`, { state: { company: selectedCompany } });
        } else {
            alert("Please select a company first.");
        }
    };

    return (
        <div className="home-container">
            <h1>Customer</h1>
            <div className="company-section">
                <label htmlFor="company-search">Search for a company</label>
                <input type="text" id="company-search" placeholder="Company" />
                <button
                    className="create-company-btn"
                    onClick={handleCreateCompanyClick}
                >
                    Create new company
                </button>
            </div>
            <div className="company-table">
                <table>
                    <thead>
                        <tr>
                            <th>Company name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr
                                key={company.id}
                                onClick={() => handleSelectCompany(company)}
                                className={selectedCompany?.id === company.id ? "selected" : ""}
                            >
                                <td>{company.name}</td>
                                <td>{company.status}</td>
                                <td>
                                    {company.status === "Document Uploaded" && (
                                        <button onClick={() => viewCompany(company.id)}>
                                            <img src="../images/eye-icon.png" alt="View" />
                                        </button>
                                    )}
                                    <button onClick={() => deleteCompany(company.id)}>
                                        <img src="../images/delete.png" alt="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="download-btn" onClick={handleDownloadDocumentsClick}>
                Download the documents
            </button>
        </div>
    );
};

export default Home;
