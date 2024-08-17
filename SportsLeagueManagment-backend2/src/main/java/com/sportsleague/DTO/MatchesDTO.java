package com.sportsleague.DTO;

import java.sql.Time;
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
public class MatchesDTO {
    private Integer matchId;
    private Integer team1Id;
    
    private Integer team2Id;
  
    private LocalDate matchDate;
//    x`
    private Integer leagueId;
}
