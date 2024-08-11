package com.sportsleague.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsleague.DTO.PaymentDTO;
import com.sportsleague.services.PaymentService;


@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<PaymentDTO> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{paymentId}")
    public PaymentDTO getPaymentById(@PathVariable Integer paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @PostMapping
    public PaymentDTO createPayment(@RequestBody PaymentDTO PaymentDTO) {
        return paymentService.createPayment(PaymentDTO);
    }

    @PutMapping("/{paymentId}")
    public PaymentDTO updatePayment(@PathVariable Integer paymentId, @RequestBody PaymentDTO PaymentDTO) {
        return paymentService.updatePayment(paymentId, PaymentDTO);
    }

    @DeleteMapping("/{paymentId}")
    public void deletePayment(@PathVariable Integer paymentId) {
        paymentService.deletePayment(paymentId);
    }
}
