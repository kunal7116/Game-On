package com.sportsleague.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.LeagueDTO;
import com.sportsleague.entities.League;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.LeagueRepository;
@Service
public class LeagueServiceImpl implements LeagueService {

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<LeagueDTO> getAllLeagues() {
        return leagueRepository.findAll().stream()
                .map(league -> modelMapper.map(league, LeagueDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public LeagueDTO getLeagueById(Integer leagueId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new ResourceNotFoundException("League not found"));
        return modelMapper.map(league, LeagueDTO.class);
    }

    @Override
    public LeagueDTO createLeague(LeagueDTO LeagueDTO) {
        League league = modelMapper.map(LeagueDTO, League.class);
        league = leagueRepository.save(league);
        return modelMapper.map(league, LeagueDTO.class);
    }

    @Override
    public LeagueDTO updateLeague(Integer leagueId, LeagueDTO LeagueDTO) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new ResourceNotFoundException("League not found"));
        modelMapper.map(LeagueDTO, league);
        league = leagueRepository.save(league);
        return modelMapper.map(league, LeagueDTO.class);
    }

    @Override
    public void deleteLeague(Integer leagueId) {
        leagueRepository.deleteById(leagueId);
    }
    
    @Override
    public List<LeagueDTO> getLeaguesBySportId(Integer sportId) {
        return leagueRepository.findBySportsId(sportId).stream()
                .map(league -> modelMapper.map(league, LeagueDTO.class))
                .collect(Collectors.toList());
    }
    

}
