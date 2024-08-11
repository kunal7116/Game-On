package com.sportsleague.services;

import java.util.List;

import com.sportsleague.DTO.PaymentDTO;

public interface PaymentService {
    List<PaymentDTO> getAllPayments();
    PaymentDTO getPaymentById(Integer paymentId);
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    PaymentDTO updatePayment(Integer paymentId, PaymentDTO paymentDTO);
    void deletePayment(Integer paymentId);
}
