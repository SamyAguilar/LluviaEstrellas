package com.example.api.controllers;

import com.example.api.models.User;
import com.example.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsuarios() {
        return userService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getPersonaById(@PathVariable Long id) {
        return userService.getUsuariosById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUsuarios(@RequestBody User user) {
        return userService.createUsuarios(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUsuario(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUsuarios(id, userDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable Long id) {
        if (userService.deleteUsuario(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
