package com.sportsleague.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class League {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private Sports sport;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal fee;
    private String rules;
    private Long price;

    @OneToMany
    @JoinColumn(name = "registeredTeam_id")
    private List<RegisteredTeam> teams; // Unidirectional mapping to Team

    @OneToMany
    @JoinColumn(name = "match_id")
    private List<Matches> matches;

    @OneToMany
    @JoinColumn(name = "payment_id")
    private List<Payment> payments; // Unidirectional mapping to Payment
}
