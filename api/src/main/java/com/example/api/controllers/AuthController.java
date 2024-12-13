package com.example.api.controllers;

import com.example.api.models.User;
import com.example.api.repositories.UserRepository;
import com.example.api.security.JwtUtil;
import com.example.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;




    @PostMapping("/register")
    public User createUsuarios(@RequestBody User user) {
        return userService.createUsuarios(user);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsuarios() {
        List<User> usuarios = userService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Verificar las credenciales del usuario
        User user = userService.getUserByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            // Si las credenciales son correctas, genera el token
            String role = user.isEsAdmin() ? "ADMIN" : "USER";
            System.out.println(role);
            System.out.println("aquillego");
            String token = JwtUtil.generateToken(user.getNombre(), role);
            System.out.println("aquillego1.0");
            // Preparar la respuesta con el token
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.ok(response);
        } else {
            // Si las credenciales son incorrectas, retornar un error
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
    }
    // Buscar un usuario por su nombre de usuario
    public User getUserByUsername(String username) {
        return userRepository.findByNombre(username).orElse(null); // Devuelve null si no encuentra el usuario
    }
}
