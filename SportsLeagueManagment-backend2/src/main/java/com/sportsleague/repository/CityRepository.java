package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportsleague.entities.City;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
}

