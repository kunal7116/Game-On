package com.sportsleague.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

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
//    private Integer team1Id;
//    private Integer team2Id;
    private LocalDate matchDate;
    private LocalTime matchTime;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "matchId")
    private MatchResult matchResult;

    // Getters and Setters
}
