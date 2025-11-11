import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Dance Academy</h2>
      <ul>
        <li>Home</li>
        <li>Courses</li>
        <li>Gallery</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;
