package com.sportsleague.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.MatchResultDTO;
import com.sportsleague.entities.MatchResult;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.MatchResultRepository;
@Service
public class MatchResultServiceImpl implements MatchResultService {

    @Autowired
    private MatchResultRepository matchResultRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public MatchResultDTO getMatchResultById(Integer resultId) {
        MatchResult matchResult = matchResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("MatchResult not found"));
        return modelMapper.map(matchResult, MatchResultDTO.class);
    }

    @Override
    public MatchResultDTO createMatchResult(MatchResultDTO MatchResultDTO) {
        MatchResult matchResult = modelMapper.map(MatchResultDTO, MatchResult.class);
        matchResult = matchResultRepository.save(matchResult);
        return modelMapper.map(matchResult, MatchResultDTO.class);
    }

    @Override
    public MatchResultDTO updateMatchResult(Integer resultId, MatchResultDTO MatchResultDTO) {
        MatchResult matchResult = matchResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("MatchResult not found"));
        modelMapper.map(MatchResultDTO, matchResult);
        matchResult = matchResultRepository.save(matchResult);
        return modelMapper.map(matchResult, MatchResultDTO.class);
    }

    @Override
    public void deleteMatchResult(Integer resultId) {
        matchResultRepository.deleteById(resultId);
    }
}
