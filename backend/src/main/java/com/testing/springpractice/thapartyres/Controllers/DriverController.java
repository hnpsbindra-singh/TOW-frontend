package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.DriverRideResponse;
import com.testing.springpractice.thapartyres.DTO.DriverRideTile;
import com.testing.springpractice.thapartyres.Service.DriverService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
public class DriverController {
    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/rides/pending")
    public List<DriverRideTile> pendingRides(){
        return driverService.pendingRides();
    }

    @GetMapping("/rides/details/{rideId}")
    public DriverRideResponse getRideDetails(@PathVariable String rideId){
        return driverService.getRideDetails(rideId);
    }
    @PatchMapping("/rides/details/{rideId}")
    public DriverRideResponse acceptRide(@PathVariable String rideId){
        return driverService.acceptRide(rideId);
    }

    @GetMapping("/rides/active")
    public List<DriverRideResponse> getActiveRides() {
        return driverService.getActiveRides();
    }

    @GetMapping("/rides/completed")
    public List<DriverRideResponse> getCompletedRides(){
        return driverService.getCompletedRides();
    }



}
