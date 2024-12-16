import { obtenerRanking } from "./Rankings";
import { useState } from 'react';
import { useEffect } from 'react';

function Ranking() {
   /// para los susarios
   const [ranking, setRanking]= useState([]);
   useEffect(() => {
     obtenerRanking()
     .then((data)=>setRanking(data))
   })

  return (
    <>
    <table className="tabla-palabras">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((ranking) => (
            <tr key={ranking.id}>
              <td>{ranking.username}</td>
              <td>{ranking.puntaje}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Ranking;