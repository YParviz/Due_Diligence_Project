import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          Navigation Bar
        </NavLink>
        <ul className="nav__list">
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
              <li>
                <button className="nav__link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
