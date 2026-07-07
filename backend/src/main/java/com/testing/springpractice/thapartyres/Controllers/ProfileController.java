package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.UpdateProfileRequest;
import com.testing.springpractice.thapartyres.Service.ProfileService;
import com.testing.springpractice.thapartyres.models.Users;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public Users me(){
        return profileService.me();
    }

    @PutMapping("/me/update")
    public Users update(@Valid @RequestBody UpdateProfileRequest request){
        return profileService.update(request);
    }

    @PutMapping("/me/update/upload-proof")
    public String updateDoc(@RequestParam MultipartFile document) throws IOException {
        return profileService.updateDoc(document);
    }


}
