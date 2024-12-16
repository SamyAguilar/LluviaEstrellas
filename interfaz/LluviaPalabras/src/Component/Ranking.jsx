import React from "react";
import "./Ranking.css";

const Ranking = ({ players }) => {
  return (
    <div className="ranking-container">
      <h1 className="ranking-title">🏆 Tabla de Ranking 🏆</h1>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Jugador</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
