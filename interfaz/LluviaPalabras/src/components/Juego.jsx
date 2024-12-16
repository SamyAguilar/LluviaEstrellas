import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Juego.css";

const Juego = () => {
  const [palabras, setPalabras] = useState([]);
  const [palabraActual, setPalabraActual] = useState(null);
  const [posicion, setPosicion] = useState({ x: 50, y: 0, velocidad: 0.1 });
  const [puntos, setPuntos] = useState(0);
  const [input, setInput] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [errorCargandoPalabras, setErrorCargandoPalabras] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarPalabras();
  }, []);

  // Cargar palabras desde la API
  const cargarPalabras = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apis/juego/palabrasLista");
      setPalabras(response.data);
      if (response.data.length > 0) {
        iniciarPalabra(response.data[0]);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.data);
        setErrorCargandoPalabras("Error al cargar las palabras: " + error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        setErrorCargandoPalabras("No se recibió respuesta del servidor.");
      } else {
        console.error("Error:", error.message);
        setErrorCargandoPalabras("Error al realizar la solicitud: " + error.message);
      }
    }
  };

  // Inicializar la primera palabra
  const iniciarPalabra = (palabra) => {
    setPalabraActual(palabra);
    setPosicion({ x: Math.random() * 90 + 5, y: 0, velocidad: 1 });
  };

  // Movimiento automático de la palabra actual
  useEffect(() => {
    if (juegoTerminado || !palabraActual) return;

    const intervalo = setInterval(() => {
      setPosicion((prev) => {
        const nuevaY = prev.y + prev.velocidad;

        if (nuevaY >= 100) {
          clearInterval(intervalo);
          setJuegoTerminado(true); // Finaliza el juego
        }

        return { ...prev, y: nuevaY };
      });
    }, 50);

    return () => clearInterval(intervalo);
  }, [juegoTerminado, palabraActual]);

  // Manejo del input del jugador
  const manejarInput = () => {
    if (!input.trim() || juegoTerminado || !palabraActual) return;

    if (palabraActual.palabra.toLowerCase() === input.toLowerCase()) {
      const palabraPuntos = palabraActual.puntos;
      let puntosGanados = 0;

      if (posicion.y < 33) puntosGanados = palabraPuntos;
      else if (posicion.y < 66) puntosGanados = palabraPuntos * 0.75;
      else puntosGanados = palabraPuntos * 0.5;

      // Redondear los puntos ganados a un entero
      puntosGanados = Math.round(puntosGanados);

      setPuntos((prev) => prev + puntosGanados);

      // Incrementar la velocidad progresivamente con cada acierto
      const nuevaVelocidad = Math.min(posicion.velocidad + 0.1, 2.0); // Velocidad máxima de 2.0
      console.log(`Nueva velocidad: ${nuevaVelocidad}`);

      // Cambiar a una nueva palabra
      const siguientePalabra = palabras[Math.floor(Math.random() * palabras.length)];
      setPalabraActual(siguientePalabra);
      setPosicion({
        x: Math.random() * 90 + 5,
        y: 0,
        velocidad: nuevaVelocidad, // Aplicar la nueva velocidad
      });
    }

    setInput("");
  };

  // Guardar puntaje al finalizar el juego
  const guardarPuntaje = async (puntajeFinal) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado. No se puede guardar el puntaje.");
      return;
    }

    try {
      console.log("Puntaje final a guardar:", puntajeFinal);

      await axios.put(
        "http://localhost:8080/puntaje",
        puntajeFinal,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Puntaje guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el puntaje:", error.response?.data || error.message);
    }
  };

  const reiniciarJuego = () => {
    setJuegoTerminado(false);
    setPuntos(0);
    cargarPalabras();
  };

  const salirJuego = () => {
    navigate("/inicio-juego");
  };

  // Guardar puntaje cuando el juego termine
  useEffect(() => {
    if (juegoTerminado) {
      guardarPuntaje(Math.round(puntos));
    }
  }, [juegoTerminado, puntos]);

  return (
    <div className="juego-container">
      {errorCargandoPalabras && <div className="error-message">{errorCargandoPalabras}</div>}

      {juegoTerminado ? (
        <div className="juego-mensaje">
          <h1>¡Perdiste!</h1>
          <p>Tu puntaje final es: {puntos}</p>
          <div className="juego-botones">
            <button className="juego-boton" onClick={reiniciarJuego}>
              Intentarlo de nuevo
            </button>
            <button className="juego-boton" onClick={salirJuego}>
              Salir
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="juego-puntos">Puntos: {puntos}</h1>
          <div id="juego" className="juego-area">
            {palabraActual && (
              <div
                className="juego-palabra"
                style={{
                  top: `${posicion.y}%`,
                  left: `${posicion.x}%`,
                }}
              >
                {palabraActual.palabra}
              </div>
            )}
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
