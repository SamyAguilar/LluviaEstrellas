import React, { useState } from "react";
import "./Login.css";
import usuario from "./img/usuario.png"; // Imagen del usuario
import WordRainGame from "./WordRainGame";
import Menu from "./Menu"; // Importamos el componente del menú

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowMenu(true); // Mostrar menú después del login
  };

  const handleStartGame = () => {
    setShowMenu(false);
    setStartGame(true); // Iniciar el juego
  };

  return (
    <div>
      {/* LOGIN SCREEN */}
      {!isLoggedIn ? (
        <div className="login-container">
          <div className="login-box">
            <img src={usuario} alt="User Icon" className="user-icon" />
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="name">Usuario</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </form>
          </div>
        </div>
      ) : showMenu ? (
        // MENU SCREEN (Usa el componente Menu)
        <Menu onStartGame={handleStartGame} />
      ) : startGame ? (
        // GAME SCREEN
        <WordRainGame />
      ) : null}
    </div>
  );
};

export default Login;
