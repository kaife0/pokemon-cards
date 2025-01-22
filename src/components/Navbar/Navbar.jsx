import React from 'react';
import './Navbar.css';

const Navbar = () => {
  const handleTitleClick = () => {
    window.location.reload(); 
  };

  return (
    <div className="navbar-container">
      <h1 className="title" onClick={handleTitleClick}>
        Pokémon <span className="badge">Cards</span>
      </h1>
      <h3 className="note">Here's the list of all Pokémon with their photos</h3>
    </div>
  );
};

export default Navbar;
