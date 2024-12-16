import React from "react";
import { useNavigate } from "react-router-dom";

const InicioJuego = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>¡Bienvenido al Juego de Lluvia de Palabras!</h1>
      <p>Selecciona una opción para comenzar:</p>
      <div style={{ marginTop: "20px" }}>
        {/* Botón para iniciar el juego */}
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "20px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/juego")}
        >
          Jugar
        </button>
        
        {/* Botón para ver la tabla de puntajes */}
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/ranking")}
        >
          Tabla de Puntajes
        </button>
      </div>
    </div>
  );
};

export default InicioJuego;
