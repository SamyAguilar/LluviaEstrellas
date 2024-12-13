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
        String token = Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Aquí se añade el rol al token
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        // Imprimir el token en la consola
        System.out.println("Token generado: " + token);

        return token;
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
