import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Juego.css";

const Juego = () => {
  const [palabras, setPalabras] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [input, setInput] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);

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
    x: Math.random() * 90 + 5, // Posición X aleatoria (5% - 95%)
    y: 0, // Posición inicial Y (parte superior)
    velocidad: Math.random() * 0.2 + 0.1 // Velocidad individual aleatoria
  });

  // Movimiento automático de las palabras
  useEffect(() => {
    if (juegoTerminado) return;

    const intervalo = setInterval(() => {
      setPosiciones((prev) => {
        const nuevasPosiciones = prev.map((pos) => ({
          ...pos,
          y: pos.y + pos.velocidad // Usa velocidad individual
        }));

        // Verificar si alguna palabra alcanzó el suelo
        if (nuevasPosiciones.some((pos) => pos.y >= 100)) {
          clearInterval(intervalo);
          setJuegoTerminado(true);
        }

        return nuevasPosiciones;
      });
    }, 50);

    return () => clearInterval(intervalo);
  }, [juegoTerminado]);

  // Manejo del input del jugador
  const manejarInput = () => {
    if (!input.trim() || juegoTerminado) return; // No hacer nada si el input está vacío o el juego terminó

    const index = palabras.findIndex((p) => p.palabra.toLowerCase() === input.toLowerCase());
    if (index !== -1) {
      const posY = posiciones[index].y;
      const palabraPuntos = palabras[index].puntos;
      let puntosGanados = 0;

      if (posY < 33) puntosGanados = palabraPuntos; // Parte superior: puntaje completo
      else if (posY < 66) puntosGanados = palabraPuntos * 0.75; // Mitad: 75%
      else puntosGanados = palabraPuntos * 0.5; // Parte inferior: 50%

      setPuntos((prev) => prev + puntosGanados);

      // Regenerar la palabra eliminada
      setPosiciones((prev) => {
        const nuevasPosiciones = [...prev];
        nuevasPosiciones[index] = generarPosicionInicial();
        return nuevasPosiciones;
      });
    }

    setInput(""); // Limpiar input
  };

  const reiniciarJuego = () => {
    setJuegoTerminado(false);
    setPuntos(0);
    cargarPalabras();
  };

  const salirJuego = () => {
    window.location.reload(); // Recargar la página para reiniciar el estado
  };

  return (
    <div className="juego-container">
      {juegoTerminado ? (
        <div className="juego-mensaje">
          <h1>¡Perdiste!</h1>
          <p>Una palabra alcanzó el suelo. Inténtalo de nuevo.</p>
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
