package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.UpdateProfileRequest;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.Security.ProjectUtils;
import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Status;
import com.testing.springpractice.thapartyres.models.Users;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProfileService {
    private final ProjectUtils projectUtils;
    private final UserRepo userRepo;

    public ProfileService(ProjectUtils projectUtils, UserRepo userRepo) {
        this.projectUtils = projectUtils;
        this.userRepo = userRepo;
    }

    public Users me() {
        Users user = projectUtils.getCurrent();
        return user;
    }

    public Users update(@Valid UpdateProfileRequest request) {
        Users user = projectUtils.getCurrent();
        user.setName(request.getName());
        user.setNumber(request.getNumber());
        user.setRecoveryKey(request.getRecoveryKey());
        if(user.getRole()== Role.DRIVER){
            user.setVehicleNumber(request.getVehicleNumber());
        }
        return userRepo.save(user);
    }

    public String updateDoc(MultipartFile document) throws IOException {
        Users user = projectUtils.getCurrent();
        if(document.getSize() > 5 * 1024 * 1024){
            throw new RuntimeException("File size cannot exceed 5 MB");
        }
        if (user.getProof() != null && user.getProof().length > 0) {
            throw new RuntimeException("Proof has already been uploaded");
        }
        if(document.isEmpty()){
            throw new RuntimeException("Please upload a file");
        }

        String type = document.getContentType();

        List<String> allowed = List.of(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/png"
        );

        if (!allowed.contains(type)) {
            throw new RuntimeException("Invalid file type");
        }
        user.setProof(document.getBytes());
        user.setProofType(document.getContentType());
        user.setProofName(document.getOriginalFilename());
        user.setProgress(Status.UPLOADED);
        userRepo.save(user);
        return document.getOriginalFilename() + " uploaded successfully";
    }
}
