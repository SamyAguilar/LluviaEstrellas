package com.example.api.services;


import  com.example.api.models.Puntaje;
import  com.example.api.repositories.PuntajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PuntajeService {

    @Autowired
    private PuntajeRepository puntajeRepository;

    public Puntaje addPuntaje(Puntaje puntaje) {
        return puntajeRepository.save(puntaje);
    }
}
