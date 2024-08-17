package com.sportsleague.entities;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

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
public class League {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leagueId;
    private String leagueName;
    private Integer prizeMoney;
    private LocalDate startDate;
    private LocalDate endDate;
    private String rules;
    private Integer entryFee;
    private Integer sportsId;
    private Integer cityId;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "leagueId")
    private List<Payment> payments;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "leagueId")
    private List<RegisteredTeam> registeredTeams;

//    @OneToMany(cascade = CascadeType.ALL)
//    @JoinColumn(name = "leagueId")
//    private List<Matches> matches;

    // Getters and Setters
}
