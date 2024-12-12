package com.example.api.services;


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

    // Listar todas las personas
    public List<User> getAllUsuarios() {
        return userRepository.findAll();
    }

    // Buscar persona por ID
    public Optional<User> getUsuariosById(Long id) {
        return userRepository.findById(id);
    }

    // Crear nuevo usuario
    public User createUsuarios(User User) {
        return userRepository.save(User);
    }

    // Actualizar una persona
    public Optional<User> updateUsuarios(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setNombre(userDetails.getNombre());
            user.setApellido(userDetails.getApellido());
            user.setEdad(userDetails.getEdad());
            return userRepository.save(user);
        });
    }

    // Eliminar una persona
    public boolean deleteUsuario(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }



    public Optional<User> autenticar(String nombre, String password) {
        return userRepository.findByName(nombre)
                .filter(u -> u.getPassword().equals(password));
    }
}
