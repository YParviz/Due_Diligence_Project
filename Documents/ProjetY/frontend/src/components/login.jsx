import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import User from "../images/user.png";
import Cadena from "../images/cadena.png";
import EyeIcon from "../images/eye-icon.png";
import EyeSlashIcon from "../images/eye-slash-icon.png";
import "./styles/login.css";
import { useAuth } from "../context/authContext";

function Login() {
  const [userLogin, setUserLogin] = useState({
    usr: "",
    pwd: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userLogin.usr || !userLogin.pwd) {
      setError("Username and password are required");
      return;
    }
    
    const data = {
      username: userLogin.usr,
      password: userLogin.pwd,
    };
    
    try {
      const userData = await login(data);
      if (userData.isAdmin) {
        navigate("/users");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="loginDiv">
      <form onSubmit={handleSubmit}>
        <h1 className="welcomeTitle">Welcome</h1>
        {error && <div>{error}</div>}
        <span className="inputWithIcon">
          <input
            type="text"
            name="usr"
            placeholder="Username"
            onChange={handleChange}
          />
          <img src={User} alt="usr" className="icon userIcon" />
        </span>

        <br />
        <span className="inputWithIcon">
          <input
            type={showPassword ? "text" : "password"}
            name="pwd"
            placeholder="Password"
            onChange={handleChange}
          />
          <img
            src={showPassword ? EyeSlashIcon : EyeIcon}
            alt="Toggle Password Visibility"
            className={`icon eyeIcon ${showPassword ? "rightIcon" : ""}`}
            onClick={togglePasswordVisibility}
          />
          <img src={Cadena} alt="pwd" className={`icon cadenaIcon ${showPassword ? "" : "leftIcon"}`} />
        </span>

        <div className="options">
          <div className="rememberMe">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link className="forgot" to="/forgot-password">Forgot password?</Link>
        </div>

        <br />
        <div className="buttonGroup">
          <button type="submit">Login</button>
          <Link className="signup" to={"/signup"}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
