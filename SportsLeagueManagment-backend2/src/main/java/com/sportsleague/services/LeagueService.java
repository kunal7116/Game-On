package com.sportsleague.services;

import java.util.List;

import com.sportsleague.DTO.LeagueDTO;

public interface LeagueService {
    List<LeagueDTO> getAllLeagues();
    LeagueDTO getLeagueById(Integer leagueId);
    LeagueDTO createLeague(LeagueDTO leagueDTO);
    LeagueDTO updateLeague(Integer leagueId, LeagueDTO leagueDTO);
    void deleteLeague(Integer leagueId);
	List<LeagueDTO> getLeaguesBySportId(Integer sportId);
}

