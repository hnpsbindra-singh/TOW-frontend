package com.testing.springpractice.thapartyres.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {
    @NotBlank
    private String name;
    @NotBlank
    @Size(min = 10, max = 10)
    @Pattern(regexp = "\\d{10}", message = "Phone number must contain exactly 10 digits")
    private String number;
    @NotBlank
    @Size(min = 8, max = 15)
    private String recoveryKey;
    private String vehicleNumber;


}
