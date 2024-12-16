package com.example.api.repositories;


import com.example.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNombre(String nombre);
    //Optional<User> findById(Long id);
}
