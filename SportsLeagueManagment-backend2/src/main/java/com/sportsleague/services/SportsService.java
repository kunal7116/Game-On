package com.sportsleague.services;

import java.util.List;

import com.sportsleague.DTO.SportsDTO;

public interface SportsService {
    List<SportsDTO> getAllSports();
    SportsDTO getSportsById(Integer sportsId);
    SportsDTO createSports(SportsDTO sportsDTO);
    SportsDTO updateSports(Integer sportsId, SportsDTO sportsDTO);
    void deleteSports(Integer sportsId);
}
