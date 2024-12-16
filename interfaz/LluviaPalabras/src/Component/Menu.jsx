import React from "react";
import "./Menu.css"; // Archivo de estilos

const Menu = ({ onStartGame }) => {
  return (
    <div className="menu-container">
      <h1 className="menu-title">LLUVIA DE PALABRAS</h1>
      <div className="menu-buttons">
        <button className="menu-button" onClick={onStartGame}>
          COMENZAR
        </button>
        <button className="menu-button">NIVEL</button>
        <button className="menu-button">RAIKING</button>
      </div>
    </div>
  );
};

export default Menu;
