// components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">MyBlog</Link>
      </div>
      <div className="nav-links">
        <Link to="/blog">Dashboard</Link>
        <Link to="/" onClick={logout}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
