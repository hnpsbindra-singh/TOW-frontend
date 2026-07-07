package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.LoginRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterResponse;
import com.testing.springpractice.thapartyres.DTO.ResetRequest;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.Security.JwtUtils;
import com.testing.springpractice.thapartyres.Security.ProjectUtils;
import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Users;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final ProjectUtils projectUtils;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepo userRepo, PasswordEncoder passwordEncoder, ProjectUtils projectUtils, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.projectUtils = projectUtils;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public RegisterResponse register(@Valid RegisterRequest request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("User already exists");
        }
        Users user = new Users();
        user.setName(request.getName());
        user.setNumber(request.getNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setRole(Role.STUDENT);
        user.setVerified(false);
        user.setRecoveryKey(projectUtils.recoveryKey());
        if(request.getRollNumber()!=null){
            user.setRollNumber(request.getRollNumber());
        }
        return mapToRegisterResponse(userRepo.save(user));
    }

    public static RegisterResponse mapToRegisterResponse(Users user) {
        return new RegisterResponse(
                user.getId(),
                user.getRole(),
                user.getName(),
                user.getNumber(),
                user.getUsername(),
                user.getRecoveryKey()
        );
    }

    public String Login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword()
        ));
        Users user = userRepo.findByUsername(request.getUsername());
        return jwtUtils.generateToken(request.getUsername(), user.getRole());
    }

    public String reset(ResetRequest request) {
        Users user = userRepo.findByUsername(request.getUsername());
        if(user==null) throw new RuntimeException("Invalid username");
        if (!request.getKey().equals(user.getRecoveryKey())){
            throw new RuntimeException("Invalid Key");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
        return "Success";
    }
}
