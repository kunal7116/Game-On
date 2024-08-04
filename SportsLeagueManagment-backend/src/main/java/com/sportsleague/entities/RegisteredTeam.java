package com.sportsleague.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "registered_teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User captain;

    @ManyToOne
    @JoinColumn(name = "league_id", nullable = false)
    private League league;
    
    @ManyToOne
    @JoinColumn(name = "sport_id", nullable = false)
    private Sports sport;

    @Column(nullable = false)
    private String teamName;

    @Column(nullable = false)
    private LocalDate registrationDate;
}


