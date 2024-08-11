package com.sportsleague.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sportsleague.DTO.CityDTO;
import com.sportsleague.entities.City;
import com.sportsleague.exception.ResourceNotFoundException;
import com.sportsleague.repository.CityRepository;
@Service
public class CityServiceImpl implements CityService {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream()
                .map(city -> modelMapper.map(city, CityDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public CityDTO getCityById(Integer cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found"));
        return modelMapper.map(city, CityDTO.class);
    }

    @Override
    public CityDTO createCity(CityDTO CityDTO) {
        City city = modelMapper.map(CityDTO, City.class);
        city = cityRepository.save(city);
        return modelMapper.map(city, CityDTO.class);
    }

    @Override
    public CityDTO updateCity(Integer cityId, CityDTO CityDTO) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found"));
        modelMapper.map(CityDTO, city);
        city = cityRepository.save(city);
        return modelMapper.map(city, CityDTO.class);
    }

    @Override
    public void deleteCity(Integer cityId) {
        cityRepository.deleteById(cityId);
    }
}
