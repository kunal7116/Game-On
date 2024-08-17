package com.sportsleague.entities;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Matches {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer matchId;

    @ManyToOne
    @JoinColumn(name = "team1Id")
    private RegisteredTeam team1;

    @ManyToOne
    @JoinColumn(name = "team2Id")
    private RegisteredTeam team2;

    private LocalDate matchDate;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "matchId")
    private MatchResult matchResult;
    
    @ManyToOne
    @JoinColumn(name = "leagueId")
    private League league;
}
