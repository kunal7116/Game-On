package com.sportsleague.services;

import java.util.List;

import com.sportsleague.DTO.UserDTO;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Integer userId);
    UserDTO createUser(UserDTO userDto);
    UserDTO updateUser(Integer userId, UserDTO userDto);
    void deleteUser(Integer userId);
	UserDTO verifyUser(String email, String rawPassword);
}
