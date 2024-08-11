package com.sportsleague.DTO;

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
public class MatchResultDTO {
    private Integer resultId;
    private Integer winnerTeamId;
    private Integer matchId;
}
