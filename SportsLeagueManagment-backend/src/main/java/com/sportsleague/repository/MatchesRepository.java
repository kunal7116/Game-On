package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.Matches;

public interface MatchesRepository extends JpaRepository<Matches,Long> {

}
