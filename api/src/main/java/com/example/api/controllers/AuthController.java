package com.example.api.controllers;

import com.example.api.models.User;
import com.example.api.services.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    private final String SECRET_KEY = "mi_clave_secreta";

    @PostMapping("/registrar")
    public ResponseEntity<User> createUsuarios(@RequestBody User usuario) {
        return ResponseEntity.ok(userService.createUsuarios(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String nombre = credentials.get("nombre");
        String password = credentials.get("contraseña");

        return userService.autenticar(nombre, password).map(user -> {
            String token = Jwts.builder()
                    .setSubject(user.getNombre())
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.status(401).build());

    }
}
