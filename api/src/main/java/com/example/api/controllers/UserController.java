package com.example.api.controllers;

import com.example.api.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import com.example.api.services.UserService;
//package com.example.sqlapi.controllers;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/personas")
public class UserController {

    @Autowired
    private UserService userService;

    // Listar todas las personas
    @GetMapping
    public List<User> getAllUsuarios() {
        return userService.getAllUsuarios();
    }

    // Obtener una persona por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getPersonaById(@PathVariable Long id) {
        return userService.getUsuariosById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear una nueva persona
    @PostMapping
    public User createUsuarios(@RequestBody User user) {
        return userService.createUsuarios(user);
    }

    // Actualizar una persona
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUsuario(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUsuarios(id, userDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar una persona
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable Long id) {
        if (userService.deleteUsuario(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
