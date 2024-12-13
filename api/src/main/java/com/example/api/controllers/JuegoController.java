package com.example.api.controllers;


import com.example.api.models.Palabra;
import com.example.api.services.PalabraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apis/juego")
public class JuegoController {

    @Autowired
    private PalabraService palabraService;
    //listar palabras
    @GetMapping("/palabras")
    public List<Palabra> getPalabras() {
        return palabraService.getAllPalabras();
    }
    //agregar palabras
    @PostMapping("/palabras")
    public Palabra addPalabra(@RequestBody Palabra palabra) {
        return palabraService.addPalabra(palabra);
    }

    // eliminar palabras
    @DeleteMapping("/palabras/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable Long id) {
        if (palabraService.deletePalabra(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
