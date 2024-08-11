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

import com.sportsleague.DTO.MatchesDTO;
import com.sportsleague.services.MatchesService;

@RestController
@RequestMapping("/api/matches")
public class MatchesController {

    @Autowired
    private MatchesService matchService;

    @GetMapping
    public List<MatchesDTO> getAllMatches() {
        return matchService.getAllMatches();
    }

    @GetMapping("/{matchId}")
    public MatchesDTO getMatchById(@PathVariable Integer matchId) {
        return matchService.getMatchById(matchId);
    }

    @PostMapping
    public MatchesDTO createMatch(@RequestBody MatchesDTO MatchesDTO) {
        return matchService.createMatch(MatchesDTO);
    }

    @PutMapping("/{matchId}")
    public MatchesDTO updateMatch(@PathVariable Integer matchId, @RequestBody MatchesDTO MatchesDTO) {
        return matchService.updateMatch(matchId, MatchesDTO);
    }

    @DeleteMapping("/{matchId}")
    public void deleteMatch(@PathVariable Integer matchId) {
        matchService.deleteMatch(matchId);
    }
}
