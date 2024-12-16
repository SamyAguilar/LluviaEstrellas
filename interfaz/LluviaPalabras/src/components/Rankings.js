import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

export const obtenerRanking = async()=>{
    try{
    const respuesta = await api.get('/ranking');
    return respuesta.data

    }catch(error){
        console.log(error);
    }

    
}