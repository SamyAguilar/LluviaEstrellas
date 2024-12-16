import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RegistroPalabras.css"; // Importa el archivo de estilos

const RegistroPalabras = () => {
  const [palabras, setPalabras] = useState([]);
  const [nuevaPalabra, setNuevaPalabra] = useState("");
  const [puntos, setPuntos] = useState("");

  // Cargar palabras al iniciar
  useEffect(() => {
    cargarPalabras();
  }, []);

  // Obtener palabras del backend
  const cargarPalabras = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/apis/juego/palabrasLista",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPalabras(response.data);
    } catch (error) {
      console.error("Error al cargar las palabras:", error);
    }
  };

  // Agregar nueva palabra
  const agregarPalabra = async () => {
    if (!nuevaPalabra.trim() || !puntos.trim()) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/apis/juego/palabras",
        {
          palabra: nuevaPalabra,
          puntos: parseInt(puntos, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPalabras([...palabras, response.data]);
      setNuevaPalabra("");
      setPuntos("");
    } catch (error) {
      console.error("Error al agregar la palabra:", error);
    }
  };

  // Eliminar palabra
  const eliminarPalabra = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/apis/juego/palabras/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPalabras(palabras.filter((palabra) => palabra.id !== id));
    } catch (error) {
      console.error("Error al eliminar la palabra:", error);
    }
  };

  return (
    <div className="registro-container">
      <h1>Registro de Palabras</h1>
      <div className="form-container">
        <input
          type="text"
          value={nuevaPalabra}
          onChange={(e) => setNuevaPalabra(e.target.value)}
          placeholder="Nueva palabra"
        />
        <input
          type="number"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
          placeholder="Puntos"
        />
        <button onClick={agregarPalabra} className="btn-agregar">
          Agregar
        </button>
      </div>
      <table className="tabla-palabras">
        <thead>
          <tr>
            <th>ID</th>
            <th>Palabra</th>
            <th>Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {palabras.map((palabra) => (
            <tr key={palabra.id}>
              <td>{palabra.id}</td>
              <td>{palabra.palabra}</td>
              <td>{palabra.puntos}</td>
              <td>
                <button
                  onClick={() => eliminarPalabra(palabra.id)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroPalabras;
