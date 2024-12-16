import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"; // Importa los estilos

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      const token = data.token;

      // Decodificar el token para obtener el rol (opcional)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      localStorage.setItem('token', token);

      if (role === 'ADMIN') {
        navigate('/registro-palabras');
      } else {
        navigate('/inicio-juego');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  const registrar = () => {
    navigate("/usuarios");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
          {/* Imagen de usuario */}
          <img src="https://via.placeholder.com/80" alt="User Icon" className="user-icon" />
        </div>
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <button className="register-button" onClick={registrar}>Registrar</button>
      </div>
    </div>
  );
};

export default Login;
