package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.DriverDetails;
import com.testing.springpractice.thapartyres.DTO.RideRequestByStudent;
import com.testing.springpractice.thapartyres.DTO.RideResponseToStudent;
import com.testing.springpractice.thapartyres.Security.VerifiedUser;
import com.testing.springpractice.thapartyres.Service.StudentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/rides")
    @VerifiedUser
    public RideResponseToStudent create(@RequestBody RideRequestByStudent request){
        return studentService.create(request);
    }

    @GetMapping("/rides")
    @VerifiedUser
    public List<RideResponseToStudent> history(){
        return studentService.history();
    }

    @GetMapping("/ride/{rideId}")
    @VerifiedUser
    public RideResponseToStudent getDetails(@PathVariable String rideId){
        return studentService.getDetails(rideId);
    }

    @DeleteMapping("/ride/{rideId}")
    @VerifiedUser
    public String cancel(@PathVariable String rideId){
        return studentService.cancel(rideId);
    }

    @GetMapping("/rides/{rideId}/driver")
    @VerifiedUser
    public DriverDetails getDriver(@PathVariable String rideId){

        return studentService.getDriver(rideId);
    }



    @PatchMapping("/rides/{rideId}/complete")
    @VerifiedUser
    public String markAsComplete(@PathVariable String rideId){
        return studentService.markAsComplete(rideId);
    }

    @GetMapping("/history/completed")
    @VerifiedUser
    public List<RideResponseToStudent> completedHistory(){
        return studentService.completedHistory();
    }

    @GetMapping("/history/accepted")
    @VerifiedUser
    public List<RideResponseToStudent> activeHistory(){
        return studentService.activeHistory();
    }




}
