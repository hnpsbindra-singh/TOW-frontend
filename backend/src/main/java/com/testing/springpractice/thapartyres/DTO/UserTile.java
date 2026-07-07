package com.testing.springpractice.thapartyres.DTO;

import com.testing.springpractice.thapartyres.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserTile {
    private String id;
    private String name;
    private Role role;
    private String username;
}
