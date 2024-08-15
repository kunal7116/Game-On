package com.sportsleague.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.Sports;

@Repository
public interface SportsRepository extends JpaRepository<Sports, Integer> {

	List<Sports> findByCityId(Integer cityId);

}
