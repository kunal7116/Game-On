//package com.sportsleague.controller;
//
//import com.razorpay.Order;
//import com.razorpay.RazorpayClient;
//import com.razorpay.RazorpayException;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/razorpay")
//public class RazorpayController {
//
//    @Value("${razorpay.key_id}")
//    private String razorpayKeyId;
//
//    @Value("${razorpay.key_secret}")
//    private String razorpayKeySecret;
//
//    @PostMapping("/create-order")
//    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
//        int amount = Integer.parseInt(data.get("amount").toString());
//
//        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
//
//        Map<String, Object> options = new HashMap<>();
//        options.put("amount", amount); // Amount in paise
//        options.put("currency", "INR");
//        options.put("receipt", "txn_123456");
//
//        Order order = client.Orders.create(options);
//
//        Map<String, String> response = new HashMap<>();
//        response.put("orderId", order.get("id"));
//        response.put("amount", String.valueOf(order.get("amount")));
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/verify")
//    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> data) {
//        // Implement payment verification logic here
//        // Use Razorpay's SDK to verify the payment signature
//        return ResponseEntity.ok(Map.of("status", "success"));
//    }
//}
