package com.testing.springpractice.thapartyres.DTO;

import com.testing.springpractice.thapartyres.models.Location;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverRideTile {
    private String rideId;
    private Location pickUp;
    private Location drop;
    LocalDateTime createdAt;
}
