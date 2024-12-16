package com.example.api.services;

import com.example.api.dto.UserScoreDTO;
import com.example.api.models.User;
import com.example.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Listar todos los usuarios
    public List<User> getAllUsuarios() {
        return userRepository.findAll();
    }

    // Buscar usuario por ID
    public Optional<User> getUsuariosById(Long id) {
        return userRepository.findById(id);
    }

    // Crear nuevo usuario
    public User createUsuarios(User user) {
        // Verificar si el usuario ya existe
        if (userRepository.findByNombre(user.getNombre()).isPresent()) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso elija uno diferente."); // Lanza una excepción si el usuario ya existe
        }

        // Cifrar la contraseña antes de guardarla si es necesario
        System.out.println("Creando usuario: " + user);
        return userRepository.save(user);
    }

    // Eliminar un usuario
    public boolean deleteUsuario(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Buscar un usuario por su nombre de usuario
    public User getUserByUsername(String username) {
        return userRepository.findByNombre(username).orElse(null); // Devuelve null si no encuentra el usuario
    }

    // Actualizar el puntaje en usuarios
    public Optional<User> actualizarPuntaje(Long userId, int nuevoPuntaje) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    if (nuevoPuntaje > existingUser.getPuntaje()) {
                        existingUser.setPuntaje(nuevoPuntaje);
                        return userRepository.save(existingUser);
                    }
                    return existingUser; // No se actualiza si el nuevo puntaje es menor
                });
    }

    public List<UserScoreDTO> getRanking() {
        return userRepository.findAll().stream()
                .filter(user -> !user.isEsAdmin()) // Filtrar usuarios que no son administradores
                .map(user -> new UserScoreDTO(user.getNombre(), user.getPuntaje())) // Mapear a DTO
                .sorted((u1, u2) -> Integer.compare(u2.getPuntaje(), u1.getPuntaje())) // Ordenar por puntaje descendente
                .toList(); // Convertir a lista
    }
}
