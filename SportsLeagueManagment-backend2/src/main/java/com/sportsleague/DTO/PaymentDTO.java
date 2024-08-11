package com.sportsleague.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

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
public class PaymentDTO {
    private Integer paymentId;
    private Integer leagueId;
    private LocalDate paymentDate;
    private LocalTime paymentTime;
    private Double amount;
}
