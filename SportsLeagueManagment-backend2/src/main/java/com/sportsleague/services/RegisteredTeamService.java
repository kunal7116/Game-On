package com.sportsleague.services;

import java.util.List;

import com.sportsleague.DTO.RegisteredTeamDTO;

public interface RegisteredTeamService {
    List<RegisteredTeamDTO> getAllRegisteredTeams();
    RegisteredTeamDTO getRegisteredTeamById(Integer teamId);
    RegisteredTeamDTO createRegisteredTeam(RegisteredTeamDTO registeredTeamDTO);
    RegisteredTeamDTO updateRegisteredTeam(Integer teamId, RegisteredTeamDTO registeredTeamDTO);
    void deleteRegisteredTeam(Integer teamId);
}

