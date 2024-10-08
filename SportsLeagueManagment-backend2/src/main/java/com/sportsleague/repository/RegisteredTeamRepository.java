package com.sportsleague.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.RegisteredTeam;

@Repository
public interface RegisteredTeamRepository extends JpaRepository<RegisteredTeam, Integer> {
	List<RegisteredTeam> findByLeagueId(Integer leagueId);
}
