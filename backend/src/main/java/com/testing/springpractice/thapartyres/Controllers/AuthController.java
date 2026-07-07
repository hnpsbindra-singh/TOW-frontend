package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.LoginRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterResponse;
import com.testing.springpractice.thapartyres.DTO.ResetRequest;
import com.testing.springpractice.thapartyres.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request){
        return authService.register(request);
    }
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){
        return authService.Login(request);
    }
    @PostMapping("/resetRequest")
    public String resetPassword(@Valid @RequestBody ResetRequest request){
        return authService.reset(request);
    }
}
