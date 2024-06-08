import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import User from "../images/user.png";
import Cadena from "../images/cadena.png";
import EyeIcon from "../images/eye-icon.png";
import EyeSlashIcon from "../images/eye-slash-icon.png";
import "./styles/login.css";

function Login() {
  const [userLogin, setUserLogin] = useState({
    usr: "",
    pwd: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // Utilisation du hook useNavigate pour la navigation
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginPageLoaded, setLoginPageLoaded] = useState(false);

  useEffect(() => {
    const fetchLoginPage = async () => {
      try {
        await axios.get('http://127.0.0.1:8000/login/');
        setLoginPageLoaded(true);
      } catch (error) {
        console.error('Error loading login page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginPage();
  }, []);

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
      const response = await axios.post('http://127.0.0.1:8000/api/login/', data);
      const { token } = response.data;
  
      // Stockage du token dans le stockage local
      localStorage.setItem('authToken', token);
      console.log("Token stored:", token); // Vérifiez si le token est correctement stocké dans le localStorage
    
      // Vérifiez le rôle de l'utilisateur
      const config = {
        headers: {
          Authorization: `Token ${token}`
        }
      };
      console.log("Request headers:", config.headers); // Vérifiez les headers de la requête
      const userResponse = await axios.get('http://127.0.0.1:8000/api/user/', config);
      const user = userResponse.data;
  
      // Redirection en fonction du rôle de l'utilisateur
      if (user.isAdmin) {
        navigate("/users");
      } else {
        navigate("/home");
      }

    } catch (error) {
      // Gestion des erreurs
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loginPageLoaded) {
    return <div>Error loading login page</div>;
  }

  return (
    <div className="loginDiv">
      <form onSubmit={handleSubmit}>
        <h1 className="welcomeTitle">welcome</h1>
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
          <button>Login</button>
          <Link className="signup" to={"/signup"}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
