package com.sportsleague.services;

import com.sportsleague.DTO.MatchResultDTO;

public interface MatchResultService {
    MatchResultDTO getMatchResultById(Integer resultId);
    MatchResultDTO createMatchResult(MatchResultDTO matchResultDTO);
    MatchResultDTO updateMatchResult(Integer resultId, MatchResultDTO matchResultDTO);
    void deleteMatchResult(Integer resultId);
}

