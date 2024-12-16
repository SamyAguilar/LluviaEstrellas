import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import RegistroPalabras from './components/RegistroPalabras';
import InicioJuego from './components/InicioJuego';
import Juego from "./components/Juego";
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro-palabras" element={<RegistroPalabras />} />
        <Route path="/inicio-juego" element={<InicioJuego />} />
        <Route path="/juego" element={<Juego />} />
      </Routes>
    </Router>
  </React.StrictMode>
);