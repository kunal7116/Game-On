package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.League;

@Repository
public interface LeagueRepository extends JpaRepository<League, Integer> {
}
