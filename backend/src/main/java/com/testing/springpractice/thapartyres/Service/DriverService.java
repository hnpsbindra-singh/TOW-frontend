package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.DriverRideResponse;
import com.testing.springpractice.thapartyres.DTO.DriverRideTile;
import com.testing.springpractice.thapartyres.Repository.RideRepo;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.Security.ProjectUtils;
import com.testing.springpractice.thapartyres.models.RideStatus;
import com.testing.springpractice.thapartyres.models.Rides;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DriverService {

    private final RideRepo rideRepo;
    private final UserRepo userRepo;
    private final ProjectUtils projectUtils;

    public DriverService(RideRepo rideRepo, UserRepo userRepo, ProjectUtils projectUtils) {
        this.rideRepo = rideRepo;
        this.userRepo = userRepo;
        this.projectUtils = projectUtils;
    }

    public List<DriverRideTile> pendingRides() {
        List<Rides> rides = rideRepo.findByStatus(RideStatus.PENDING);
        List<DriverRideTile> response = new ArrayList<>();
        for (Rides ride : rides) {
            response.add(mapToResponse(ride));
        }
        return response;
    }

    private DriverRideTile mapToResponse(Rides ride) {
        Users student = userRepo.findById(ride.getUserId()).orElseThrow(
                () -> new RuntimeException("Student Not Found"));
        DriverRideTile response =
                new DriverRideTile();
        response.setRideId(ride.getId());
        response.setPickUp(ride.getPickUp());
        response.setDrop(ride.getDrop());
        response.setCreatedAt(ride.getCreatedAt());

        return response;
    }

    public DriverRideResponse getRideDetails(String rideId) {
        Users driver = projectUtils.getCurrent();
        Rides ride = rideRepo.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Invalid Ride"));
        if (!driver.getId().equals(ride.getDriverId())) {
            throw new RuntimeException("Unauthorized");
        }
        return mapToDriverRideResponse(ride);
    }

    private DriverRideResponse mapToDriverRideResponse(Rides ride) {
        Users student = userRepo.findById(ride.getUserId()).orElseThrow(
                () -> new RuntimeException("Student Not Found"));
        DriverRideResponse response = new DriverRideResponse();
        response.setPickUp(ride.getPickUp());
        response.setDrop(ride.getDrop());
        response.setMobileNumber(student.getNumber());
        response.setRideId(ride.getId());
        response.setStudentId(student.getId());
        response.setStudentName(student.getName());
        response.setCreatedAt(ride.getCreatedAt());
        return response;
    }

    public DriverRideResponse acceptRide(String rideId) {
        Rides ride = rideRepo.findById(rideId).orElseThrow(
                ()-> new RuntimeException("Invalid Ride")
        );
        Users driver = projectUtils.getCurrent();
        if (ride.getStatus() != RideStatus.PENDING) {
            throw new RuntimeException("Ride is no longer available");
        }
        ride.setDriverId(driver.getId());
        ride.setStatus(RideStatus.ACCEPTED);
        return mapToDriverRideResponse(rideRepo.save(ride));
    }

    public List<DriverRideResponse> getActiveRides() {
        Users driver = projectUtils.getCurrent();
        List<Rides> rides = rideRepo.findByDriverIdAndStatus(
                driver.getId(),
                RideStatus.ACCEPTED
        );
        return rides.stream()
                .map(this::mapToDriverRideResponse)
                .toList();
    }

    public List<DriverRideResponse> getCompletedRides() {
        Users driver = projectUtils.getCurrent();
        List<Rides> rides = rideRepo.findByDriverIdAndStatus(
                driver.getId(),
                RideStatus.COMPLETED
        );
        return rides.stream()
                .map(this::mapToDriverRideResponse)
                .toList();
    }
}