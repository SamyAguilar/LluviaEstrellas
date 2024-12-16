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
    <ul>
      {ranking.map((user)=>
      (<li>{user.name}</li>))}
    </ul>
    </>
  );
}

export default Ranking;