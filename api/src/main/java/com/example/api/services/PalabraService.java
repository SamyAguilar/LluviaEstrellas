package com.example.api.services;


import com.example.api.models.Palabra;
import com.example.api.repositories.PalabraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PalabraService {

    @Autowired
    private PalabraRepository palabraRepository;
    // listar palabras
    public List<Palabra> getAllPalabras() {
        return palabraRepository.findAll();
    }

    // agreagr palabra
    public Palabra addPalabra(Palabra palabra) {
        return palabraRepository.save(palabra);
    }

    // Eliminar una palabra
    public boolean deletePalabra(Long id) {
        if (palabraRepository.existsById(id)) {
            palabraRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
