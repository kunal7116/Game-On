package com.sportsleague.entities;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
public class Sports {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sportsId;
    
    @Enumerated(EnumType.STRING)
    private SportType sportType;
    private Integer cityId;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "sportsId")
    private List<RegisteredTeam> registeredTeams;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "sportsId")
    private List<League> leagues;

    // Getters and Setters
}
