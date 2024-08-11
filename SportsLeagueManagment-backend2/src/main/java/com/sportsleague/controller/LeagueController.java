package com.sportsleague.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsleague.DTO.LeagueDTO;
import com.sportsleague.services.LeagueService;

@RestController
@RequestMapping("/api/leagues")
public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    @GetMapping
    public List<LeagueDTO> getAllLeagues() {
        return leagueService.getAllLeagues();
    }

    @GetMapping("/{leagueId}")
    public LeagueDTO getLeagueById(@PathVariable Integer leagueId) {
        return leagueService.getLeagueById(leagueId);
    }

    @PostMapping
    public LeagueDTO createLeague(@RequestBody LeagueDTO LeagueDTO) {
        return leagueService.createLeague(LeagueDTO);
    }

    @PutMapping("/{leagueId}")
    public LeagueDTO updateLeague(@PathVariable Integer leagueId, @RequestBody LeagueDTO LeagueDTO) {
        return leagueService.updateLeague(leagueId, LeagueDTO);
    }

    @DeleteMapping("/{leagueId}")
    public void deleteLeague(@PathVariable Integer leagueId) {
        leagueService.deleteLeague(leagueId);
    }
}
