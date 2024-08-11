package com.sportsleague.entities;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class RegisteredTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teamId;
    private String teamName;
    private Integer leagueId;
    private Integer sportsId;
    private LocalDate registrationDate;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "teamId")
    private List<Matches> matches;
}
