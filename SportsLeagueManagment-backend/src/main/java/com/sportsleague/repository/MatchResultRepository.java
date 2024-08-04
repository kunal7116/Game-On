package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.MatchResult;

public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {

}
