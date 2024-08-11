package com.sportsleague.services;

import java.util.List;

import com.sportsleague.DTO.CityDTO;

public interface CityService {
    List<CityDTO> getAllCities();
    CityDTO getCityById(Integer cityId);
    CityDTO createCity(CityDTO cityDTO);
    CityDTO updateCity(Integer cityId, CityDTO cityDTO);
    void deleteCity(Integer cityId);
}
