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
public class RegisteredTeamDTO {
    private Integer userId;
    private Integer teamId;
    private String teamName;
    private Integer leagueId;
    private Integer sportsId;
    private LocalDate date;
}

