package com.sportsleague.entities;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Matches {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "league_id")
    private League league;

    @ManyToOne
    @JoinColumn(name = "team1_id")
    private RegisteredTeam team1; // Unidirectional mapping to Team

    @ManyToOne
    @JoinColumn(name = "team2_id")
    private RegisteredTeam team2; // Unidirectional mapping to Team

    private LocalDate date;
    private LocalTime time;
}
