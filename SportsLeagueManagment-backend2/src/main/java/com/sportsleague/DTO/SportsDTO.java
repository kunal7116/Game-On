package com.sportsleague.DTO;

import com.sportsleague.entities.SportType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SportsDTO {
    private Integer sportsId;
    private SportType sportType;
    private Integer cityId;
}

