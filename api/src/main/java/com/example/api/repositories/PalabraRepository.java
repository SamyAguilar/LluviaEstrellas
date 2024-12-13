package com.example.api.repositories;


import com.example.api.models.Palabra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PalabraRepository extends JpaRepository<Palabra, Long> {

}
