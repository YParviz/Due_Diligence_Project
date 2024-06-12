import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./styles/navbar.css";
import Logo from '../images/LogoS4.PNG'; // Assurez-vous que le chemin est correct

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <nav className="nav container">
        <div className="nav__logo">
          <NavLink to="/login">
            <img src={Logo} alt="Logo" className="nav__logo-img" />
          </NavLink>
        </div>
        <ul className="nav__list">
          {user.logged && (
            <>
              <li>
                <NavLink to="/home" className="nav__link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="nav__link">
                  Profile
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to="/about" className="nav__link">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav__link">
              Contact
            </NavLink>
          </li>
          {user.logged && (
            <li className="nav__list-logout">
              <button className="nav__link nav__button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
