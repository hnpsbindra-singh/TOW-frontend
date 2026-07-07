package com.testing.springpractice.thapartyres.Security;

import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.models.Users;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class UserVerificationClass {
    @Autowired
    UserRepo userRepo;
    @Before("@annotation(com.testing.springpractice.thapartyres.Security.VerifiedUser)")
    public void checkVerification() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String username = authentication.getName();
        Users user = userRepo.findByUsername(username);
        if (user==null) throw new RuntimeException("Invalid access");
        if (!user.isVerified()){
            throw new RuntimeException("Complete the profile by " +
                    "adding proof of admission in profile section and wait Until admin approves");
        }
    }
}
