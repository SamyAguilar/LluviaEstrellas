package com.example.api.filters;

import com.example.api.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // No aplicar filtro a las rutas /register y /login
        return "/register".equals(path) || "/login".equals(path) || "/users".equals(path) || "/apis/juego/palabrasLista".equals(path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Falta el encabezado Authorization o tiene un formato incorrecto");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // Extraer el token sin "Bearer "
        try {
            // Extraer el username del token
            String username = JwtUtil.extractUsername(token);

            if (username != null) {
                // Extraer el rol del token
                String role = JwtUtil.extractRole(token);
                System.out.println("Token válido: Usuario=" + username + ", Rol=" + role);

                // Configurar la autenticación en el contexto de seguridad
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            System.err.println("Error al validar el token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

}
