package com.sportsleague.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsleague.DTO.MatchResultDTO;
import com.sportsleague.services.MatchResultService;


@RestController
@RequestMapping("/api/match-results")
public class MatchResultController {

    @Autowired
    private MatchResultService matchResultService;

    @GetMapping("/{resultId}")
    public MatchResultDTO getMatchResultById(@PathVariable Integer resultId) {
        return matchResultService.getMatchResultById(resultId);
    }

    @PostMapping
    public MatchResultDTO createMatchResult(@RequestBody MatchResultDTO MatchResultDTO) {
        return matchResultService.createMatchResult(MatchResultDTO);
    }

    @PutMapping("/{resultId}")
    public MatchResultDTO updateMatchResult(@PathVariable Integer resultId, @RequestBody MatchResultDTO MatchResultDTO) {
        return matchResultService.updateMatchResult(resultId, MatchResultDTO);
    }

    @DeleteMapping("/{resultId}")
    public void deleteMatchResult(@PathVariable Integer resultId) {
        matchResultService.deleteMatchResult(resultId);
    }
}
