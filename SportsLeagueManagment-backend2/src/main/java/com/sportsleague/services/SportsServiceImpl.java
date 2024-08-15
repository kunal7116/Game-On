package com.sportsleague.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.SportsDTO;
import com.sportsleague.entities.Sports;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.SportsRepository;

@Service
public class SportsServiceImpl implements SportsService {

    @Autowired
    private SportsRepository sportsRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<SportsDTO> getAllSports() {
        return sportsRepository.findAll().stream()
                .map(sports -> modelMapper.map(sports, SportsDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public SportsDTO getSportsById(Integer sportsId) {
        Sports sports = sportsRepository.findById(sportsId)
                .orElseThrow(() -> new ResourceNotFoundException("Sports not found"));
        return modelMapper.map(sports, SportsDTO.class);
    }

    @Override
    public SportsDTO createSports(SportsDTO SportsDTO) {
        Sports sports = modelMapper.map(SportsDTO, Sports.class);
        sports = sportsRepository.save(sports);
        return modelMapper.map(sports, SportsDTO.class);
    }

    @Override
    public SportsDTO updateSports(Integer sportsId, SportsDTO SportsDTO) {
        Sports sports = sportsRepository.findById(sportsId)
                .orElseThrow(() -> new ResourceNotFoundException("Sports not found"));
        modelMapper.map(SportsDTO, sports);
        sports = sportsRepository.save(sports);
        return modelMapper.map(sports, SportsDTO.class);
    }

    @Override
    public void deleteSports(Integer sportsId) {
        sportsRepository.deleteById(sportsId);
    }
    
    @Override
    public List<SportsDTO> getSportsByCityId(Integer cityId) {
        List<Sports> sportsList = sportsRepository.findByCityId(cityId);
        return sportsList.stream()
                .map(sports -> modelMapper.map(sports, SportsDTO.class))
                .collect(Collectors.toList());
    }

}
