package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.Sports;

@Repository
public interface SportsRepository extends JpaRepository<Sports, Integer> {
}
