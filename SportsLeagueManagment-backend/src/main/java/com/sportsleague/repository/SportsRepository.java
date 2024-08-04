package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.Sports;

public interface SportsRepository extends JpaRepository<Sports, Long> {

}
