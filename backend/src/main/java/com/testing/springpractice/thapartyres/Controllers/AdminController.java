package com.testing.springpractice.thapartyres.Controllers;
import com.testing.springpractice.thapartyres.DTO.DriverRideResponse;
import com.testing.springpractice.thapartyres.DTO.RidesResponse;
import com.testing.springpractice.thapartyres.DTO.UserResponse;
import com.testing.springpractice.thapartyres.DTO.UserTile;
import com.testing.springpractice.thapartyres.Service.AdminService;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/students")
    public List<UserTile> getStudents(){
        return adminService.getStudents();
    }

    @GetMapping("/drivers")
    public List<UserTile> getDrivers(){
        return adminService.getDrivers();
    }

    @GetMapping("/user/{userId}")
    public UserResponse getDetailsOfUser(@PathVariable String userId){
        return adminService.getDetailsOfUser(userId);
    }

    @GetMapping("/pending-Verifications")
    public List<UserTile> getRequests(){
        return adminService.getRequests();
    }

    @GetMapping("/users/{userId}/proof")
    public ResponseEntity<byte[]> viewProof(@PathVariable String userId) {

        Users user = adminService.getUserProof(userId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(user.getProofType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + user.getProofName() + "\"")
                .body(user.getProof());
    }


    @PatchMapping("/verify/{userId}")
    public String verify(@PathVariable String userId){
        return adminService.verify(userId);
    }

    @PatchMapping("/reject/{userId}")
    public String reject(@PathVariable String userId){
        return adminService.reject(userId);
    }

    @PatchMapping("/make-admin/{userId}")
    public String makeAdmin(@PathVariable String userId) {
        return adminService.makeAdmin(userId);
    }

    @PatchMapping("/make-driver/{userId}")
    public String makeDriver(@PathVariable String userId) {
        return adminService.makeDriver(userId);
    }

    @DeleteMapping("/users/{userId}")
    public String deleteUser(@PathVariable String userId){
        return adminService.deleteUser(userId);
    }

    @GetMapping("/rides")
    public List<RidesResponse> getAllRides() {
        return adminService.getAllRides();
    }

}
