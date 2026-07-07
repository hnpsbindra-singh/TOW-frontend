package com.testing.springpractice.thapartyres.DTO;


import com.testing.springpractice.thapartyres.models.Location;
import com.testing.springpractice.thapartyres.models.RideStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RideResponseToStudent {
    private String id;
    private String driverId;
    private String driverName;
    private String driverNumber;
    private String vehicleNumber;
    private Location pickUp;
    private Location drop;
    private RideStatus status;
    LocalDateTime createdAt;
}
