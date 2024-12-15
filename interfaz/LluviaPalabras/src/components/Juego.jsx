import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/apis/juego/palabras", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPalabras(response.data);
      inicializarPosiciones(response.data.length);
    } catch (error) {
      console.error("Error al cargar las palabras:", error);
    }
  };

  // Inicializar posiciones iniciales
  const inicializarPosiciones = (cantidad) => {
    const posicionesIniciales = Array.from({ length: cantidad }, () => ({
      x: Math.random() * 90 + 5, // Posición X aleatoria
      y: 0, // Posición inicial Y (parte superior)
    }));
    setPosiciones(posicionesIniciales);
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPosiciones((prev) =>
        prev.map((pos) => ({
          ...pos,
          y: pos.y + 1, // Incrementar posición Y para simular caída
        }))
      );
    }, 500); // Actualizar cada 500ms
  
    return () => clearInterval(intervalo); // Limpiar intervalo al desmontar
  }, []);
  
  const manejarInput = () => {
    const index = palabras.findIndex((p) => p.palabra.toLowerCase() === input.toLowerCase());
  
    if (index !== -1) {
      // Calcular puntaje
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
  
  useEffect(() => {
    const palabrasFuera = posiciones.filter((pos) => pos.y >= 100);
  
    if (palabrasFuera.length > 0) {
      palabrasFuera.forEach((_, index) => {
        const palabraPuntos = palabras[index].puntos;
        setPuntos((prev) => prev - palabraPuntos * 0.5); // Penalización
      });
  
      setPalabras((prev) => prev.filter((_, i) => posiciones[i].y < 100));
      setPosiciones((prev) => prev.filter((pos) => pos.y < 100));
    }
  }, [posiciones]);
  
  return (
    <div>
      <h1>Puntos: {puntos}</h1>
      <div id="juego">
        {/* Aquí se mostrarán las palabras */}
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
