import './styles/forgotPwd.css';
import { useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(email);
            setMessage('Check your email for further instructions');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className='forgotPasswordDiv'>
            <form onSubmit={handleSubmit}>
                {message && <div>{message}</div>}
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email" 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button type="submit">Reset Password</button>
                <Link className='backToLogin' to='/'>Back to Login</Link>
            </form>
        </div>
    );
}

export default ForgotPassword;
