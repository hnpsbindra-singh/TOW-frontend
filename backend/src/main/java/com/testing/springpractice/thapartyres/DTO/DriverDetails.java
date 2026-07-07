package com.testing.springpractice.thapartyres.DTO;

import com.testing.springpractice.thapartyres.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverDetails {
    private String id;
    private String name;
    private String number;
    private String vehicleNumber;
}
