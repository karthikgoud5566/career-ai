package com.careerai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careerai.dto.UserRequest;
import com.careerai.dto.UserResponse;
import com.careerai.services.UserService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userservice;

	public UserController(UserService userservice)
	{
		this.userservice=userservice;
	}


	@PostMapping
	public ResponseEntity<UserResponse> createUser( @Valid @RequestBody UserRequest request)
	{
		UserResponse response=userservice.createUser(request);

		 return ResponseEntity.ok(response);
	}

	@GetMapping("/me")
	public ResponseEntity<UserResponse> getCurrentUser() {

	    return ResponseEntity.ok(
	            userservice.getCurrentUser()
	    );
	}


}
