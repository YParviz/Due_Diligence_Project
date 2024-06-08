import './styles/signupForm.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import CryptoJS from 'crypto-js';
import EyeIcon from '../images/eye-icon.png';
import EyeSlashIcon from '../images/eye-slash-icon.png';

function Signup() {
    const [userRegister, setUserRegister] = useState({
        usr: "",
        email: "",
        pwd: "",
        pwd2: "",
        company: "",
    });
    const { signup, login, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserRegister((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === "pwd2" && value !== userRegister.pwd) {
            setError("Passwords don't match");
        } else if ((name === "pwd" || name === "pwd2") && value.length < 8) {
            setError("Password must be at least 8 characters long");
        } else if (name === "company" && value.length < 3) {
            setError("Company name must be at least 3 characters long");
        } else if (name === "usr" && value.length < 3) {
            setError("Username must be at least 3 characters long");
        } else if (name === "email" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            setError("Invalid email address");
        } else {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userRegister.company || !userRegister.usr || !userRegister.pwd || !userRegister.email) {
            setError("All fields are required");
            return;
        }
        if (userRegister.pwd !== userRegister.pwd2) {
            setError("Passwords don't match");
            return;
        }
        const pwd = userRegister.pwd; // Changed to avoid double hashing
        const data = {
            username: userRegister.usr,
            email: userRegister.email,
            password: pwd,
            company: userRegister.company,
        };
        try {
            const userData = await signup(data);
            const token = userData.token;
            localStorage.setItem('token', token);
            await login({ username: userRegister.usr, password: userRegister.pwd }); // Changed to use plain password
            navigate('/projects');
        } catch (error) {
            if (error.message === 'Username already exists') {
                setError('Username already exists');
            } else if (error.message === 'Invalid email address') {
                setError('Invalid email address');
            } else {
                setError('Signup failed');
            }
        }
    };
    
    
    
    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className='signupForm'>
            <form onSubmit={handleSubmit}>
                <h1 className="createAccountTitle">Create an account</h1>
                {error && <div className="error">{error}</div>}
                <span>
                    <input type="text" name="company" placeholder="Company name" className="textInput" required onChange={handleChange} />
                </span>
                <span>
                    <input type="text" name="usr" placeholder="Username" className="textInput" required onChange={handleChange} />
                </span>
                <span>
                    <input type="email" name="email" placeholder="Email" className="textInput" required onChange={handleChange} />
                </span>
                <span className="inputWithIcon">
                    <input type={showPassword ? "text" : "password"} name="pwd" placeholder="Password" className="textInput" required onChange={handleChange} />
                    <img src={showPassword ? EyeSlashIcon : EyeIcon} alt="Toggle Password Visibility" className={`icon eyeIcon ${showPassword ? "rightIcon" : ""}`} onClick={togglePasswordVisibility} />
                </span>
                <span className="inputWithIcon">
                    <input type={showPassword ? "text" : "password"} name="pwd2" placeholder="Confirm Password" className="textInput" required onChange={handleChange} />
                    <img src={showPassword ? EyeSlashIcon : EyeIcon} alt="Toggle Password Visibility" className={`icon eyeIcon ${showPassword ? "rightIcon" : ""}`} onClick={togglePasswordVisibility} />
                </span>
                <div className="buttonContainer">
                    <button type="submit" disabled={loading}>Sign up</button>
                    <Link className='signin signup' to={'/'}>Sign in</Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;
