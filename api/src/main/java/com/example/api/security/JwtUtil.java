package com.example.api.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private static final long EXPIRATION_TIME = 864_000_000; // 10 días

    /*public static String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", "ADMIN") // Aquí se añade el rol al token
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }*/
    /// mejora pendiente en generar token en JWTUTIL
    public static String generateToken(String username, String role) {
        try {
            // Genera el token JWT
            String token = Jwts.builder()
                    .setSubject(username) // Establece el sujeto (usuario)
                    .claim("role", role) // Añade el rol al token
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Establece la fecha de expiración
                    .signWith(key, SignatureAlgorithm.HS512) // Firma el token con la clave y algoritmo
                    .compact(); // Compacta el token en una cadena

            // Imprimir el token en la consola para depuración (opcional)
            System.out.println("Token generado: " + token);

            return token; // Retorna el token generado
        } catch (Exception e) {
            // Manejo de excepciones en caso de error al generar el token
            System.err.println("Error al generar el token: " + e.getMessage());
            return null; // Retorna null si hay un error
        }
    }



    public static String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public static String extractRole(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class); // Extraer el rol del token
    }
}
