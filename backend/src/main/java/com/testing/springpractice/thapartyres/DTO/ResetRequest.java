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
public class ResetRequest {
    @Email(
            regexp = "^[A-Za-z0-9._%+-]+@thapar\\.edu$",
            message = "Enter a valid Thapar email"
    )
    @NotBlank
    private String username;
    @NotBlank
    @Size(min = 8, max = 15)
    private String newPassword;
    @NotBlank
    private String key;
}
