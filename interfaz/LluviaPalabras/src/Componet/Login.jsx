import React from "react";
import "./Login.css"; 

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
          <i className="fas fa-user-circle"></i>
        </div>
        <form>
          <div className="input-group">
            <label htmlFor="name">Usuario</label>
            <input type="name" id="name" placeholder="Increse su usuario" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="Increse su contraseña" required />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> ¿Quieres recordar la contraseña?
            </label>
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
