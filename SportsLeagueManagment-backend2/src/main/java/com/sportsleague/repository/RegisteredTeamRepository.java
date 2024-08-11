package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.RegisteredTeam;

@Repository
public interface RegisteredTeamRepository extends JpaRepository<RegisteredTeam, Integer> {
}
