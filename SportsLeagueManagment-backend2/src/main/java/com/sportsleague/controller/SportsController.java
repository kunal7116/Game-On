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

import com.sportsleague.DTO.SportsDTO;
import com.sportsleague.services.SportsService;


@RestController
@RequestMapping("/api/sports")
public class SportsController {

    @Autowired
    private SportsService sportsService;

    @GetMapping
    public List<SportsDTO> getAllSports() {
        return sportsService.getAllSports();
    }

    @GetMapping("/{sportsId}")
    public SportsDTO getSportsById(@PathVariable Integer sportsId) {
        return sportsService.getSportsById(sportsId);
    }

    @PostMapping
    public SportsDTO createSports(@RequestBody SportsDTO SportsDTO) {
        return sportsService.createSports(SportsDTO);
    }

    @PutMapping("/{sportsId}")
    public SportsDTO updateSports(@PathVariable Integer sportsId, @RequestBody SportsDTO SportsDTO) {
        return sportsService.updateSports(sportsId, SportsDTO);
    }

    @DeleteMapping("/{sportsId}")
    public void deleteSports(@PathVariable Integer sportsId) {
        sportsService.deleteSports(sportsId);
    }
}
