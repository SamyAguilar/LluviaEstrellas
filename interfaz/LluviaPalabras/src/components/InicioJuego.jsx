import React from "react";
import { useNavigate } from "react-router-dom";

const InicioJuego = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>¡Bienvenido al Juego de Lluvia de Palabras!</h1>
        <p>Selecciona una opción para comenzar:</p>
        <div style={{ marginTop: "20px" }}>
          <button
            className="login-button"
            style={{ marginRight: "20px" }}
            onClick={() => navigate("/juego")}
          >
            Jugar
          </button>

          <button
            className="login-button"
            onClick={() => navigate("/tabla-puntajes")}
          >
            Tabla de Puntajes
          </button>
        </div>
      </div>
    </div>
  );
};

export default InicioJuego;
