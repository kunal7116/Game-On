package com.sportsleague.services;

import java.util.List;
import com.sportsleague.DTO.MatchesDTO;

public interface MatchesService {
	List<MatchesDTO> getAllMatches();

	MatchesDTO getMatchById(Integer matchId);

	MatchesDTO createMatch(MatchesDTO matchesDTO);

	MatchesDTO updateMatch(Integer matchId, MatchesDTO matchesDTO);

	void deleteMatch(Integer matchId);
}
