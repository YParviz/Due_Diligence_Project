import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios'; 
import './styles/profile.css'

function Profile() {
    const { user } = useAuth();
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmitEmailChange = async (e) => {
        e.preventDefault();
        try {
            if (!user.id) {
                console.error('User ID is not defined');
                return;
            }
            const response = await axios.patch(`/api/user-details/${user.id}/`, { email: newEmail });
            console.log(response.data);
            // Vous pouvez mettre à jour le contexte utilisateur avec le nouvel e-mail ici si nécessaire
        } catch (error) {
            console.error(error);
            setError('Failed to update email');
        }
    };

    const handleSubmitPasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.patch(`/api/user-details/${user.id}/`, { password: newPassword }); // Assuming you have an endpoint to update user details
            console.log(response.data);
            // You can update the user context with the new password here if needed
        } catch (error) {
            console.error(error);
            setError('Failed to update password');
        }
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="profile-info">
                <p>Name: {user.username}</p>
                <p>Company: {user.company}</p>
                <p>Email: {user.email}</p>
            </div>
            <div className="form-group">
                <h3>Change Email</h3>
                <form onSubmit={handleSubmitEmailChange}>
                    <label>New Email</label>
                    <input type="email" placeholder="New Email" value={newEmail} onChange={handleEmailChange} />
                    <div className="button-group">
                      <button type="submit">Change Email</button>
                    </div>
                </form>
            </div>
            <div className="form-group">
                <h3>Change Password</h3>
                <form onSubmit={handleSubmitPasswordChange}>
                    <label>New Password</label>
                    <input type="password" placeholder="New Password" value={newPassword} onChange={handlePasswordChange} />
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    <div className="button-group">
                      <button type="submit">Change Password</button>
                    </div>
                </form>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default Profile;
