package com.careerai.dto;

public class LoginResponse {

    private String message;
    private String email;

    private String token;

    public LoginResponse(String message, String email,String token) {
        this.message = message;
        this.email = email;
        this.token=token;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }
}
