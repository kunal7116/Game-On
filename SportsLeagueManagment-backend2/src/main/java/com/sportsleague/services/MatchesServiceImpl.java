package com.sportsleague.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.MatchesDTO;
import com.sportsleague.entities.Matches;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.MatchesRepository;

@Service
public class MatchesServiceImpl implements MatchesService {

    @Autowired
    private MatchesRepository matchRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<MatchesDTO> getAllMatches() {
        return matchRepository.findAll().stream()
                .map(match -> modelMapper.map(match, MatchesDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public MatchesDTO getMatchById(Integer matchId) {
        Matches match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));
        return modelMapper.map(match, MatchesDTO.class);
    }

    @Override
    public MatchesDTO createMatch(MatchesDTO matchDto) {
        Matches match = modelMapper.map(matchDto, Matches.class);
        match = matchRepository.save(match);
        return modelMapper.map(match, MatchesDTO.class);
    }

    @Override
    public MatchesDTO updateMatch(Integer matchId, MatchesDTO matchDto) {
        Matches match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));
        modelMapper.map(matchDto, match);
        match = matchRepository.save(match);
        return modelMapper.map(match, MatchesDTO.class);
    }

    @Override
    public void deleteMatch(Integer matchId) {
        matchRepository.deleteById(matchId);
    }
}
