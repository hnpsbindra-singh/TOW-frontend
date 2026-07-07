package com.testing.springpractice.thapartyres.Security;

import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ProjectUtils {

    private final UserRepo userRepo;

    public ProjectUtils(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    public void userExists(Users user){
        if(user==null) throw new RuntimeException("User Doesn't Exist");
    }

    public Users getCurrent(){
        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();
        String username = authentication.getName();
        Users user = userRepo.findByUsername(username);
        return user;
    }
    public String recoveryKey(){
        String recoveryKey = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
        return recoveryKey;
    }
}
