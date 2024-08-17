package com.sportsleague.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sportsleague.DTO.RegisteredTeamDTO;
import com.sportsleague.entities.RegisteredTeam;
import com.sportsleague.repository.RegisteredTeamRepository;
import com.sportsleague.services.RegisteredTeamService;

@RestController
@RequestMapping("/api/registered-teams")
public class RegisteredTeamController {

    @Autowired
    private RegisteredTeamService registeredTeamService;
    
    @Autowired 
    private RegisteredTeamRepository registeredTeamRepository;
    
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<RegisteredTeamDTO> getAllRegisteredTeams() {
        return registeredTeamService.getAllRegisteredTeams();
    }

    @GetMapping("/{teamId}")
    public RegisteredTeamDTO getRegisteredTeamById(@PathVariable Integer teamId) {
        return registeredTeamService.getRegisteredTeamById(teamId);
    }

    @PostMapping
    public RegisteredTeamDTO createRegisteredTeam(@RequestBody RegisteredTeamDTO registeredTeamDTO) {
        return registeredTeamService.createRegisteredTeam(registeredTeamDTO);
    }

    @PutMapping("/{teamId}")
    public RegisteredTeamDTO updateRegisteredTeam(@PathVariable Integer teamId, @RequestBody RegisteredTeamDTO registeredTeamDTO) {
        return registeredTeamService.updateRegisteredTeam(teamId, registeredTeamDTO);
    }

    @DeleteMapping("/{teamId}")
    public void deleteRegisteredTeam(@PathVariable Integer teamId) {
        registeredTeamService.deleteRegisteredTeam(teamId);
    }
    
    @GetMapping("/{leagueId}/teams")
    public List<RegisteredTeamDTO> getTeamsByLeagueId(@PathVariable Integer leagueId) {
        return registeredTeamRepository.findByLeagueId(leagueId).stream()
                .map(team -> modelMapper.map(team, RegisteredTeamDTO.class))
                .collect(Collectors.toList());
    }



}
