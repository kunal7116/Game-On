package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.MatchResult;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Integer> {
}

