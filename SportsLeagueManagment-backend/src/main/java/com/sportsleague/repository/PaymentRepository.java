package com.sportsleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsleague.entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
