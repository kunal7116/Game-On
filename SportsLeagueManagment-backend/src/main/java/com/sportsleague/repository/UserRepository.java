package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
