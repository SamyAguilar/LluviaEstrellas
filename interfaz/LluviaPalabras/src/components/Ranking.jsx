import { obtenerRanking } from "./Rankings";
import { useState } from 'react';
import { useEffect } from 'react';
import "./ranking.css";

function Ranking() {
   /// para los susarios
   const [ranking, setRanking]= useState([]);
   useEffect(() => {
     obtenerRanking()
     .then((data)=>setRanking(data))
   })

   return (
    <div className="ranking-container"> 
      <h1>Ranking</h1>
      <table className="tabla-palabras">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((item) => (
            <tr key={item.id}>
              <td>{item.username}</td>
              <td>{item.puntaje}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default Ranking;