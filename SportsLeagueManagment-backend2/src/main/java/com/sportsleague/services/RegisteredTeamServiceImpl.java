package com.sportsleague.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.RegisteredTeamDTO;
import com.sportsleague.entities.RegisteredTeam;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.RegisteredTeamRepository;

@Service
public class RegisteredTeamServiceImpl implements RegisteredTeamService {

    @Autowired
    private RegisteredTeamRepository registeredTeamRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<RegisteredTeamDTO> getAllRegisteredTeams() {
        return registeredTeamRepository.findAll().stream()
                .map(team -> modelMapper.map(team, RegisteredTeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public RegisteredTeamDTO getRegisteredTeamById(Integer teamId) {
        RegisteredTeam team = registeredTeamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("RegisteredTeam not found"));
        return modelMapper.map(team, RegisteredTeamDTO.class);
    }

    @Override
    public RegisteredTeamDTO createRegisteredTeam(RegisteredTeamDTO RegisteredTeamDTO) {
        RegisteredTeam team = modelMapper.map(RegisteredTeamDTO, RegisteredTeam.class);
        team = registeredTeamRepository.save(team);
        return modelMapper.map(team, RegisteredTeamDTO.class);
    }

    @Override
    public RegisteredTeamDTO updateRegisteredTeam(Integer teamId, RegisteredTeamDTO RegisteredTeamDTO) {
        RegisteredTeam team = registeredTeamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("RegisteredTeam not found"));
        modelMapper.map(RegisteredTeamDTO, team);
        team = registeredTeamRepository.save(team);
        return modelMapper.map(team, RegisteredTeamDTO.class);
    }

    @Override
    public void deleteRegisteredTeam(Integer teamId) {
        registeredTeamRepository.deleteById(teamId);
    }
}

