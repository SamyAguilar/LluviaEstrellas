import React, { useState, useEffect } from "react";
import axios from "axios";

const Juego = () => {
  const [palabras, setPalabras] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    cargarPalabras();
  }, []);

  // Cargar palabras desde la API
  const cargarPalabras = async () => {
    console.log(localStorage.getItem("token"));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token en el almacenamiento local");

      const response = await axios.get("http://localhost:8080/apis/juego/palabras", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPalabras(response.data);
      inicializarPosiciones(response.data.length);
    } catch (error) {
      console.error("Error al cargar las palabras:", error);
      alert("No se pudieron cargar las palabras. Verifique su conexión o token.");
    }
  };

  // Inicializar posiciones iniciales
  const inicializarPosiciones = (cantidad) => {
    const posicionesIniciales = Array.from({ length: cantidad }, () => ({
      x: Math.random() * 90 + 5, // Posición X aleatoria (5% - 95%)
      y: 0, // Posición inicial Y (parte superior)
    }));
    setPosiciones(posicionesIniciales);
  };

  // Movimiento automático de las palabras
  useEffect(() => {
    const velocidad = Math.max(500 - puntos, 200); // Velocidad disminuye con más puntos, mínimo 200ms
    const intervalo = setInterval(() => {
      setPosiciones((prev) =>
        prev.map((pos) => ({
          ...pos,
          y: pos.y + 1, // Incrementar posición Y para simular caída
        }))
      );
    }, velocidad);

    return () => clearInterval(intervalo); // Limpiar intervalo al desmontar
  }, [puntos]);

  // Manejo del input del jugador
  const manejarInput = () => {
    if (!input.trim()) return; // No hacer nada si el input está vacío

    const index = palabras.findIndex((p) => p.palabra.toLowerCase() === input.toLowerCase());
    if (index !== -1) {
      // Calcular puntaje según posición
      const posY = posiciones[index].y;
      const palabraPuntos = palabras[index].puntos;
      let puntosGanados = 0;

      if (posY < 33) puntosGanados = palabraPuntos; // Parte superior: puntaje completo
      else if (posY < 66) puntosGanados = palabraPuntos * 0.75; // Mitad: 75%
      else puntosGanados = palabraPuntos * 0.5; // Parte inferior: 50%

      setPuntos((prev) => prev + puntosGanados);

      // Eliminar palabra de la pantalla
      setPalabras((prev) => prev.filter((_, i) => i !== index));
      setPosiciones((prev) => prev.filter((_, i) => i !== index));
    }

    setInput(""); // Limpiar input
  };

  // Manejar palabras que salen de la pantalla
  useEffect(() => {
    const palabrasFuera = posiciones.filter((pos) => pos.y >= 100);

    if (palabrasFuera.length > 0) {
      palabrasFuera.forEach((_, index) => {
        const palabraPuntos = palabras[index]?.puntos || 0; // Manejo seguro si palabras[index] es undefined
        setPuntos((prev) => prev - palabraPuntos * 0.5); // Penalización
      });

      setPalabras((prev) => prev.filter((_, i) => posiciones[i].y < 100));
      setPosiciones((prev) => prev.filter((pos) => pos.y < 100));
    }
  }, [posiciones]);

  return (
    <div>
      <h1>Puntos: {puntos}</h1>
      <div
        id="juego"
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          overflow: "hidden",
          border: "2px solid black",
          backgroundColor: "#f0f0f0",
        }}
      >
        {posiciones.map((pos, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${pos.y}%`,
              left: `${pos.x}%`,
              fontSize: "18px",
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
      />
    </div>
  );
};

export default Juego;