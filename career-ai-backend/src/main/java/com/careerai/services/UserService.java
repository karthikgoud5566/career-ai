package com.careerai.services;


import com.careerai.dto.UserRequest;
import com.careerai.dto.UserResponse;
import com.careerai.entity.User;
import com.careerai.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@Service
public class UserService {



	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
	    this.userRepository = userRepository;
	    this.passwordEncoder= passwordEncoder;
	}


	public UserResponse createUser(UserRequest request) {

	    User user = new User();

	    user.setName(request.getName());
	    user.setEmail(request.getEmail());
	    user.setPassword(passwordEncoder.encode(request.getPassword()));
	    user.setRole("USER");

	    User savedUser = userRepository.save(user);

	    UserResponse response = new UserResponse();

	    response.setId(savedUser.getId());
	    response.setName(savedUser.getName());
	    response.setEmail(savedUser.getEmail());

	    return response;
	}

	public UserResponse getCurrentUser() {

	    Authentication authentication =
	            SecurityContextHolder
	                    .getContext()
	                    .getAuthentication();



	    String email = authentication.getName();

	    User user = userRepository
	            .findByEmail(email)
	            .orElseThrow(() ->
	                    new RuntimeException("User not found"));


	    UserResponse response = new UserResponse(
	            user.getId(),
	            user.getName(),
	            user.getEmail()
	    );

	    return response;
	}

}
