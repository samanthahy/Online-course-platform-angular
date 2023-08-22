package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Order;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentDao  extends JpaRepository<Payment, Integer> {
}
