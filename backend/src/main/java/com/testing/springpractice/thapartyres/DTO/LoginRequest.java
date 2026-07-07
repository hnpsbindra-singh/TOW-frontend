package com.testing.springpractice.thapartyres.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @Email
    @NotBlank
    private String username;
    @NotBlank
    @Size(min = 8, max = 15)
    private String password;
}
