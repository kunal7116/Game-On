package com.sportsleague.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
public class MatchesDTO {
		private Integer matchId;
	    private Integer team1Id;
	    private Integer team2Id;
	    private LocalDate matchDate;
	    private LocalTime matchTime;
	    private Integer leagueId;
}
