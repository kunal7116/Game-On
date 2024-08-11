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

import com.sportsleague.DTO.CityDTO;
import com.sportsleague.services.CityService;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    @Autowired
    private CityService cityService;

    @GetMapping
    public List<CityDTO> getAllCities() {
        return cityService.getAllCities();
    }

    @GetMapping("/{cityId}")
    public CityDTO getCityById(@PathVariable Integer cityId) {
        return cityService.getCityById(cityId);
    }

    @PostMapping
    public CityDTO createCity(@RequestBody CityDTO CityDTO) {
        return cityService.createCity(CityDTO);
    }

    @PutMapping("/{cityId}")
    public CityDTO updateCity(@PathVariable Integer cityId, @RequestBody CityDTO CityDTO) {
        return cityService.updateCity(cityId, CityDTO);
    }

    @DeleteMapping("/{cityId}")
    public void deleteCity(@PathVariable Integer cityId) {
        cityService.deleteCity(cityId);
    }
}
