import React, { useState, useEffect } from "react";
import axios from "axios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    password: "",
    esAdmin: false,
  });
  const [mensaje, setMensaje] = useState("");

  // Cargar lista de usuarios
  useEffect(() => {
    listarUsuarios();
  }, []);

  const listarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Manejar cambio en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Enviar formulario para agregar usuario
  const agregarUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        nuevoUsuario,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMensaje("Usuario agregado con éxito");
      listarUsuarios(); // Recargar lista de usuarios
      setNuevoUsuario({ nombre: "", apellido: "", password: "", esAdmin: false });
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      setMensaje("Error al agregar el usuario");
    }
  };

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>

      {/* Formulario para agregar usuario */}
      <form className="form-agregar-usuario" onSubmit={agregarUsuario}>
        <h2>Agregar Usuario</h2>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={nuevoUsuario.apellido}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={nuevoUsuario.password}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="form-group">
          <label>¿Es Administrador?</label>
          <input
            type="checkbox"
            name="esAdmin"
            checked={nuevoUsuario.esAdmin}
            onChange={manejarCambio}
          />
        </div>
        <button type="submit" className="btn-agregar">Agregar</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      {/* Tabla para listar usuarios */}
      <div className="lista-usuarios">
        <h2>Lista de Usuarios</h2>
        {usuarios.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.esAdmin ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
