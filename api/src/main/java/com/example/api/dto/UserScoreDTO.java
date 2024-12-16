package com.example.api.dto;

public class UserScoreDTO {
    private String username;
    private int puntaje;

    public UserScoreDTO(String username, int puntaje) {
        this.username = username;
        this.puntaje = puntaje;
    }

    public String getUsername() {
        return username;
    }

    public int getPuntaje() {
        return puntaje;
    }
}
