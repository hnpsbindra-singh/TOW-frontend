package com.testing.springpractice.thapartyres.Repository;

import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Status;
import com.testing.springpractice.thapartyres.models.Users;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {
    Users findByid(String id);

    Users findByUsername(String username);

    long countByRole(Role role);

    List<Users> findByRole(Role role);

    boolean existsByUsername(@Email(
            regexp = "^[A-Za-z0-9._%+-]+@thapar\\.edu$",
            message = "Enter a valid Thapar email"
    ) @NotBlank String username);

    List<Users> findByProgress(Status progress);

    List<Users> findByProgressAndVerified(Status status, boolean b);
}
