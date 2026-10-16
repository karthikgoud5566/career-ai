package com.careerai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRequest {


		@NotBlank(message="name is required")
	    private String name;



		@NotBlank(message="email is reequired")
		@Email(message="enter valid email")
	    private String email;


		@NotBlank(message="password is reequired")
		@Size(min=8,max=100,message="Password must be between 8 and 100 characters")
	    private String password;

	    public String getName() {
	        return name;
	    }

	    public void setName(String name) {
	        this.name = name;
	    }

	    public String getEmail() {
	        return email;
	    }

	    public void setEmail(String email) {
	        this.email = email;
	    }

	    public String getPassword() {
	        return password;
	    }

	    public void setPassword(String password) {
	        this.password = password;
	    }
	}
