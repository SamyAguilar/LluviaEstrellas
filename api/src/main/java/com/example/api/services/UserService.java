package com.example.api.services;

import com.example.api.models.User;
import com.example.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

  /*  @Autowired
    private PasswordEncoder passwordEncoder;*/

    // Listar todas las personas
    public List<User> getAllUsuarios() {
        return userRepository.findAll();
    }

    // Buscar persona por ID
    public Optional<User> getUsuariosById(Long id) {
        return userRepository.findById(id);
    }

    // Crear nuevo usuario (con contraseña cifrada)
    public User createUsuarios(User user) {
        System.out.println("Creando usuario: " + user);
        // Cifrar la contraseña antes de guardarla
        return userRepository.save(user);
    }

    /*// Actualizar usuario
    public Optional<User> updateUsuarios(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setNombre(userDetails.getNombre());
            user.setApellido(userDetails.getApellido());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                // Actualizar la contraseña si se proporciona
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            return userRepository.save(user);
        });
    }*/

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

    /*// Autenticación del usuario
    public Optional<User> autenticar(String nombre, String password) {
        return userRepository.findByNombre(nombre)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }*/
}
