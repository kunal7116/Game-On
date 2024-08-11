package com.sportsleague.DTO;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString	
public class LeagueDTO {
	private Integer leagueId;
    private String leagueName;
    private Integer prizeMoney;
    private LocalDate startDate;
    private LocalDate endDate;
    private String rules;
    private Integer entryFee;
    private Integer sportsId;
    private Integer cityId;
}
