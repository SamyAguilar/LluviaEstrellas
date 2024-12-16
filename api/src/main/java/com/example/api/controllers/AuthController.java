package com.example.api.controllers;

import com.example.api.dto.UserScoreDTO;
import com.example.api.models.User;
import com.example.api.repositories.UserRepository;
import com.example.api.security.JwtUtil;
import com.example.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<?> createUsuarios(@RequestBody User user) {
        try {
            User createdUser = userService.createUsuarios(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage())); // Código 409 Conflict
        }
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

    @PutMapping("/puntaje")
    public ResponseEntity<User> actualizarPuntaje(@RequestHeader("Authorization") String authHeader, @RequestBody int nuevoPuntaje) {
        // Verificar que el encabezado de autorización esté presente y tenga el formato correcto
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Manejo si no hay token
        }

        // Extraer el token sin "Bearer "
        String token = authHeader.substring(7);

        // Obtener el usuario actual desde el token
        String username = JwtUtil.extractUsername(token);
        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Manejo si el usuario es nulo
        }

        return userService.actualizarPuntaje(user.getId(), nuevoPuntaje)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<UserScoreDTO>> getRanking() {
        List<UserScoreDTO> ranking = userService.getRanking();
        return ResponseEntity.ok(ranking);
    }


}
