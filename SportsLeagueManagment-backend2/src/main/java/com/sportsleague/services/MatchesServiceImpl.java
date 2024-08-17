package com.sportsleague.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.MatchesDTO;
import com.sportsleague.entities.Matches;
import com.sportsleague.entities.RegisteredTeam;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.LeagueRepository;
import com.sportsleague.repository.MatchesRepository;
import com.sportsleague.repository.RegisteredTeamRepository;

@Service
public class MatchesServiceImpl implements MatchesService {

	@Autowired
	private MatchesRepository matchRepository;

	@Autowired
	private RegisteredTeamRepository registeredTeamRepo;

	@Autowired
	private LeagueRepository leagueRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public List<MatchesDTO> getAllMatches() {
		return matchRepository.findAll().stream().map(match -> modelMapper.map(match, MatchesDTO.class))
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

		RegisteredTeam findTeam1 = registeredTeamRepo.findById(matchDto.getTeam1Id()).get();
		RegisteredTeam findTeam2 = registeredTeamRepo.findById(matchDto.getTeam2Id()).get();

		match.setTeam1(findTeam1);
		match.setTeam2(findTeam2);
		match.setLeague(leagueRepo.findById(matchDto.getLeagueId()).get());
		Matches matches = matchRepository.save(match);
		return modelMapper.map(matches, MatchesDTO.class);
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
