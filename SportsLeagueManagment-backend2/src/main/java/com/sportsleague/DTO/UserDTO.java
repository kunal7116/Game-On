package com.sportsleague.DTO;

import com.sportsleague.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString	
public class UserDTO {
    private Integer userId;
    private String firstname;
    private String lastname;
    private String email;
    private Role role;
    private String password;
}

