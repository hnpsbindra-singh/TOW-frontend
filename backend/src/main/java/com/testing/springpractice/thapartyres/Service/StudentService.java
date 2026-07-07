package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.DriverDetails;
import com.testing.springpractice.thapartyres.DTO.RideRequestByStudent;
import com.testing.springpractice.thapartyres.DTO.RideResponseToStudent;
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
public class StudentService {
    private final ProjectUtils projectUtils;
    private final RideRepo rideRepo;
    private final UserRepo userRepo;

    public StudentService(ProjectUtils projectUtils, RideRepo rideRepo, UserRepo userRepo) {
        this.projectUtils = projectUtils;
        this.rideRepo = rideRepo;
        this.userRepo = userRepo;
    }

    public RideResponseToStudent create(RideRequestByStudent request) {
        Rides ride = new Rides();
        Users user = projectUtils.getCurrent();
        ride.setUserId(user.getId());
        ride.setPickUp(request.getPickUp());
        ride.setDrop(request.getDrop());
        ride.setDriverId(null);

        return mapToRideResponse(rideRepo.save(ride));
    }

    private RideResponseToStudent mapToRideResponse(Rides ride){
        RideResponseToStudent response = new RideResponseToStudent();

        response.setId(ride.getId());
        response.setPickUp(ride.getPickUp());
        response.setDrop(ride.getDrop());
        response.setStatus(ride.getStatus());
        response.setCreatedAt(ride.getCreatedAt());

        if(ride.getDriverId() != null){
            Users driver = userRepo.findById(ride.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver Not Found"));

            response.setDriverId(driver.getId());
            response.setDriverName(driver.getName());
            response.setDriverNumber(driver.getNumber());
            response.setVehicleNumber(driver.getVehicleNumber());
        }

        return response;
    }

    public List<RideResponseToStudent> history() {
        Users user = projectUtils.getCurrent();
        List<Rides> rides = rideRepo.findByUserId(user.getId());
        List<RideResponseToStudent> res = new ArrayList<>();
        for (int i = 0; i < rides.size(); i++) {
            res.add(mapToRideResponse(rides.get(i)));
        }
        return res;
    }

    public RideResponseToStudent getDetails(String rideId) {
        Rides ride = rideRepo.findById(rideId).orElseThrow(
                ()-> new RuntimeException("Invalid Ride")
        );
        Users student = projectUtils.getCurrent();
        if(!ride.getUserId().equals(student.getId())){
            throw new RuntimeException("No access");
        }
        return mapToRideResponse(ride);

    }

    public String cancel(String rideId) {
        Rides ride = rideRepo.findById(rideId).orElseThrow(
                ()-> new RuntimeException("Invalid Ride")
        );
        Users student = projectUtils.getCurrent();
        if (ride.getDriverId() != null) {
            throw new RuntimeException("Ride already accepted by a driver");
        }
        if(!ride.getUserId().equals(student.getId())){
            throw new RuntimeException("No access");
        }
        if (ride.getStatus()!=RideStatus.PENDING){
            throw new RuntimeException("Only pending rides can be cancelled");
        }
        ride.setStatus(RideStatus.CANCELLED);
        rideRepo.save(ride);
        return "Ride Cancelled";
    }

    public DriverDetails getDriver(String rideId) {
        Rides ride = rideRepo.findById(rideId).orElseThrow(
                ()-> new RuntimeException("Invalid Ride")
        );
        Users student = projectUtils.getCurrent();
        if(!ride.getUserId().equals(student.getId())){
            throw new RuntimeException("No access");
        }
        if (ride.getStatus()!=RideStatus.ACCEPTED){
            throw new RuntimeException("Drivers have not accepted");
        }
        Users driver = userRepo.findById(ride.getDriverId()).orElseThrow(
                ()->new RuntimeException("Drivers have not accepted")
        );
        return mapToDriverResponse(driver);

    }

    private DriverDetails mapToDriverResponse(Users driver) {
        DriverDetails details = new DriverDetails();
        details.setId(driver.getId());
        details.setName(driver.getName());
        details.setNumber(driver.getNumber());
        details.setVehicleNumber(driver.getVehicleNumber());
        return details;
    }

    public String markAsComplete(String rideId) {
        Rides ride = rideRepo.findById(rideId).orElseThrow(
                ()-> new RuntimeException("Invalid Ride")
        );
        Users student = projectUtils.getCurrent();
        if(!ride.getUserId().equals(student.getId())){
            throw new RuntimeException("No access");
        }
        if (ride.getStatus()==RideStatus.COMPLETED){
            throw new RuntimeException("Ride Already Completed");
        }
        if (ride.getStatus() == RideStatus.CANCELLED) {
            throw new RuntimeException("Ride already cancelled");
        }
        if (ride.getStatus()!=RideStatus.ACCEPTED){
            throw new RuntimeException("Drivers have not accepted");
        }
        ride.setStatus(RideStatus.COMPLETED);
        rideRepo.save(ride);
        return "Marked As Completed";
    }

    public List<RideResponseToStudent> completedHistory() {
        Users user = projectUtils.getCurrent();
        List<Rides> activeRides = rideRepo.findByUserIdAndStatus(user.getId(),
                RideStatus.COMPLETED);
        List<RideResponseToStudent> res = new ArrayList<>();
        for (int i = 0; i < activeRides.size(); i++) {
            res.add(mapToRideResponse(activeRides.get(i)));
        }
        return res;
    }

    public List<RideResponseToStudent> activeHistory() {
        Users user = projectUtils.getCurrent();
        List<Rides> activeRides = rideRepo.findByUserIdAndStatus(user.getId(),
                RideStatus.ACCEPTED);
        List<RideResponseToStudent> res = new ArrayList<>();
        for (int i = 0; i < activeRides.size(); i++) {
            res.add(mapToRideResponse(activeRides.get(i)));
        }
        return res;
    }
}
