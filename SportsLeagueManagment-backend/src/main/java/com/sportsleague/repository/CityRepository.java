package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.City;

public interface CityRepository extends JpaRepository<City, Long> {

}
