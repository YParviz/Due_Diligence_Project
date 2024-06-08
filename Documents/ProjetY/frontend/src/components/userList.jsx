import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../api/userApi';
import acceptedLogo from '../images/accepted.png';
import pendingLogo from '../images/pending.png';
import './styles/userList.css';

function UserList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const usersData = await getUsers();
                console.log("Users:", usersData); // Vérifiez la structure des données retournées
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const handlePendingClick = (userId) => {
        navigate(`/validate-user/${userId}`);
    };

    const handleBackClick = () => {
        navigate(-1); // Navigue à la page précédente
    };

    return (
        <div className="userListContainer">
            <h1 className="userListTitle">Admin</h1>
            <table className="userTable">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Company</th>
                        <th>Admission Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.company}</td>
                            <td>
                                {user.validation ? (
                                    user.validation.is_validated ? (
                                        <span className="admissionStatus">
                                            Accepted
                                            <img src={acceptedLogo} alt="Accepted" className="statusLogo" />
                                        </span>
                                    ) : (
                                        <span className="admissionStatus" onClick={() => handlePendingClick(user.id)}>
                                            Pending
                                            <img src={pendingLogo} alt="Pending" className="statusLogo" />
                                        </span>
                                    )
                                ) : (
                                    <span className="admissionStatus" onClick={() => handlePendingClick(user.id)}>
                                        Pending
                                        <img src={pendingLogo} alt="Pending" className="statusLogo" />
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="backButton" onClick={handleBackClick}>Back</button>
        </div>
    );
}

export default UserList;
