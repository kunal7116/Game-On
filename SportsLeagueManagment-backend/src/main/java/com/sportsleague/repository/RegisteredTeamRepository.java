package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.RegisteredTeam;

public interface RegisteredTeamRepository extends JpaRepository<RegisteredTeam, Long> {

}
