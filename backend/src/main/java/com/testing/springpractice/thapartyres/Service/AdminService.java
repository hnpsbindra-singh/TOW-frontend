package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.DriverRideResponse;
import com.testing.springpractice.thapartyres.DTO.RidesResponse;
import com.testing.springpractice.thapartyres.DTO.UserResponse;
import com.testing.springpractice.thapartyres.DTO.UserTile;
import com.testing.springpractice.thapartyres.Repository.RideRepo;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.models.Rides;
import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Status;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    private final UserRepo userRepo;
    private final RideRepo rideRepo;


    public AdminService(UserRepo userRepo, RideRepo rideRepo) {
        this.userRepo = userRepo;
        this.rideRepo = rideRepo;
    }


    public UserTile toUserTile(Users user) {
        if (user == null) {
            return null;
        }
        return new UserTile(user.getId(), user.getName(), user.getRole(), user.getUsername());
    }
    public List<UserTile> getStudents() {
        List<Users> users = userRepo.findByRole(Role.STUDENT);
        List<UserTile> res = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            res.add(toUserTile(users.get(i)));
        }
        return res;
    }

    public List<UserTile> getDrivers() {
        List<Users> users = userRepo.findByRole(Role.DRIVER);
        List<UserTile> res = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            res.add(toUserTile(users.get(i)));
        }
        return res;
    }

    public UserResponse toUserResponse(Users user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getRole(),
                user.getName(),
                user.getNumber(),
                user.getUsername()
        );
    }


    private RidesResponse toRideResponse(Rides ride) {
        RidesResponse response = new RidesResponse();
        response.setRideId(ride.getId());
        response.setPickUp(ride.getPickUp());
        response.setDrop(ride.getDrop());
        response.setStatus(ride.getStatus());
        response.setCreatedAt(ride.getCreatedAt());

        userRepo.findById(ride.getUserId()).ifPresentOrElse(
            student -> {
                response.setStudentId(student.getId());
                response.setStudentName(student.getName());
                response.setStudentNumber(student.getNumber());
            },
            () -> {
                response.setStudentId(ride.getUserId());
                response.setStudentName("[Deleted Student]");
                response.setStudentNumber("—");
            }
        );

        if (ride.getDriverId() != null) {
            userRepo.findById(ride.getDriverId()).ifPresentOrElse(
                driver -> {
                    response.setDriverId(driver.getId());
                    response.setDriverName(driver.getName());
                    response.setDriverNumber(driver.getNumber());
                },
                () -> {
                    response.setDriverId(ride.getDriverId());
                    response.setDriverName("[Deleted Driver]");
                    response.setDriverNumber("—");
                }
            );
        }

        return response;
    }

    public List<RidesResponse> getAllRides() {

        List<Rides> rides = rideRepo.findAllByOrderByCreatedAtDesc();

        List<RidesResponse> res = new ArrayList<>();

        for (Rides ride : rides) {
            res.add(toRideResponse(ride));
        }

        return res;
    }

    public UserResponse getDetailsOfUser(String userId) {
        Users user = userRepo.findByid(userId);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return toUserResponse(user);

    }

    public List<UserTile> getRequests() {
        List<Users> users = userRepo.findByProgressAndVerified(Status.UPLOADED, false);

        List<UserTile> res = new ArrayList<>();
        for (Users user : users) {
            res.add(toUserTile(user));
        }

        return res;
    }

    public Users getUserProof(String userId) {
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProof() == null) {
            throw new RuntimeException("Proof not uploaded");
        }

        return user;
    }

    public String verify(String userId) {

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProof() == null) {
            throw new RuntimeException("Proof not uploaded");
        }

        if (user.getProgress() ==Status.VERIFIED) {
            throw new RuntimeException("User already verified");
        }
        user.setProgress(Status.VERIFIED);
        user.setVerified(true);
        userRepo.save(user);
        return "Verified Successfully";

    }

    public String reject(String userId) {

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getProgress() == Status.PENDING) {
            throw new RuntimeException("User has not uploaded proof");
        }
        if (user.getProgress() == Status.VERIFIED) {
            throw new RuntimeException("Verified user cannot be rejected");
        }
        user.setProof(null);
        user.setProofName(null);
        user.setProofType(null);
        user.setVerified(false);
        user.setProgress(Status.PENDING);
        userRepo.save(user);
        return "Proof rejected successfully";
    }

    public String makeAdmin(String userId) {

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("User is already an admin");
        }

        user.setRole(Role.ADMIN);
        userRepo.save(user);

        return "User promoted to ADMIN successfully";
    }

    public String makeDriver(String userId) {

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.DRIVER) {
            throw new RuntimeException("User is already a driver");
        }

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin cannot be promoted to driver");
        }

        user.setRole(Role.DRIVER);
        userRepo.save(user);

        return "User promoted to DRIVER successfully";
    }

    public String deleteUser(String userId) {
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin cannot be deleted");
        }
        userRepo.delete(user);

        return "Delete Successfull";

    }
}

