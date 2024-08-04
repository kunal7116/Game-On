package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.League;

public interface LeagueRepository extends JpaRepository<League, Long> {

}
