package com.testing.springpractice.thapartyres.DTO;

import com.testing.springpractice.thapartyres.models.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    private String name;
    @NotBlank
    @Size(min = 10, max = 10)
    @Pattern(regexp = "\\d{10}", message = "Phone number must contain exactly 10 digits")
    private String number;
    @Email(
            regexp = "^[A-Za-z0-9._%+-]+@thapar\\.edu$",
            message = "Enter a valid Thapar email"
    )
    @NotBlank
    private String username;

    @NotBlank
    @Size(min= 8, max = 15)
    private String password;
    private String rollNumber;
}
