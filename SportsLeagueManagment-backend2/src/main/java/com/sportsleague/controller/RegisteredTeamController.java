package com.sportsleague.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsleague.DTO.RegisteredTeamDTO;
import com.sportsleague.services.RegisteredTeamService;

@RestController
@RequestMapping("/api/registered-teams")
public class RegisteredTeamController {

    @Autowired
    private RegisteredTeamService registeredTeamService;

    @GetMapping
    public List<RegisteredTeamDTO> getAllRegisteredTeams() {
        return registeredTeamService.getAllRegisteredTeams();
    }

    @GetMapping("/{teamId}")
    public RegisteredTeamDTO getRegisteredTeamById(@PathVariable Integer teamId) {
        return registeredTeamService.getRegisteredTeamById(teamId);
    }

    @PostMapping
    public RegisteredTeamDTO createRegisteredTeam(@RequestBody RegisteredTeamDTO RegisteredTeamDTO) {
        return registeredTeamService.createRegisteredTeam(RegisteredTeamDTO);
    }

    @PutMapping("/{teamId}")
    public RegisteredTeamDTO updateRegisteredTeam(@PathVariable Integer teamId, @RequestBody RegisteredTeamDTO RegisteredTeamDTO) {
        return registeredTeamService.updateRegisteredTeam(teamId, RegisteredTeamDTO);
    }

    @DeleteMapping("/{teamId}")
    public void deleteRegisteredTeam(@PathVariable Integer teamId) {
        registeredTeamService.deleteRegisteredTeam(teamId);
    }
}
