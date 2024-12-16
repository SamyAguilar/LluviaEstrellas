import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Juego.css";

const Juego = () => {
  const [palabras, setPalabras] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [input, setInput] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  
  const navigate = useNavigate(); // Inicializar el hook

  useEffect(() => {
    cargarPalabras();
  }, []);

  // Cargar palabras desde la API
  const cargarPalabras = async () => {
    const response = await axios.get("http://localhost:8080/apis/juego/palabrasLista");
    setPalabras(response.data);
    inicializarPosiciones(response.data);
  };

  // Inicializar posiciones iniciales
  const inicializarPosiciones = (palabras) => {
    const posicionesIniciales = palabras.map(() => generarPosicionInicial());
    setPosiciones(posicionesIniciales);
  };

  const generarPosicionInicial = () => ({
    x: Math.random() * 90 + 5,
    y: 0,
    velocidad: Math.random() * 0.2 + 0.1
  });

  // Movimiento automático de las palabras
  useEffect(() => {
    if (juegoTerminado) return;

    const intervalo = setInterval(() => {
      setPosiciones((prev) => {
        const nuevasPosiciones = prev.map((pos) => ({
          ...pos,
          y: pos.y + pos.velocidad,
        }));

        if (nuevasPosiciones.some((pos) => pos.y >= 100)) {
          clearInterval(intervalo);
          setJuegoTerminado(true);
          setPuntos((prevPuntos) => {
            guardarPuntaje(prevPuntos);
            return prevPuntos;
          });
        }

        return nuevasPosiciones;
      });
    }, 50);

    return () => clearInterval(intervalo);
  }, [juegoTerminado]);

  // Manejo del input del jugador
  const manejarInput = () => {
    if (!input.trim() || juegoTerminado) return;

    const index = palabras.findIndex((p) => p.palabra.toLowerCase() === input.toLowerCase());
    if (index !== -1) {
      const posY = posiciones[index].y;
      const palabraPuntos = palabras[index].puntos;
      let puntosGanados = 0;

      if (posY < 33) puntosGanados = palabraPuntos;
      else if (posY < 66) puntosGanados = palabraPuntos * 0.75;
      else puntosGanados = palabraPuntos * 0.5;

      setPuntos((prev) => prev + puntosGanados);

      // Regenerar la palabra eliminada
      setPosiciones((prev) => {
        const nuevasPosiciones = [...prev];
        nuevasPosiciones[index] = generarPosicionInicial();
        return nuevasPosiciones;
      });
    }

    setInput("");
  };

  // Guardar puntaje en el backend
  const guardarPuntaje = async (puntajeFinal) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado. No se puede guardar el puntaje.");
      return;
    }

    try {
      console.log("Puntaje final a guardar:", puntajeFinal);
      const response = await axios.put(
        "http://localhost:8080/puntaje",
        puntajeFinal,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Puntaje guardado exitosamente:", response.data);
    } catch (error) {
      console.error("Error al guardar el puntaje:", error.response?.data || error.message);
    }
  };

  const reiniciarJuego = () => {
    setJuegoTerminado(false);
    setPuntos(0);
    cargarPalabras();
  };

  // Función para salir del juego
  const salirJuego = () => {
    navigate("/inicio-juego"); // Redirigir a la página de inicio del juego
  };

  return (
    <div className="juego-container">
      {juegoTerminado ? (
        <div className="juego-mensaje">
          <h1>¡Perdiste!</h1>
          <p>Tu puntaje final es: {puntos}</p>
          <div className="juego-botones">
            <button className="juego-boton" onClick={reiniciarJuego}>Intentarlo de nuevo</button>
            <button className="juego-boton" onClick={salirJuego}>Salir</button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="juego-puntos">Puntos: {puntos}</h1>
          <div id="juego" className="juego-area">
            {posiciones.map((pos, index) => (
              <div
                key={index}
                className="juego-palabra"
                style={{
                  top: `${pos.y}%`,
                  left: `${pos.x}%`,
                }}
              >
                {palabras[index]?.palabra}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Escribe una palabra"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") manejarInput();
            }}
            className="juego-input"
          />
        </>
      )}
    </div>
  );
};

export default Juego;
