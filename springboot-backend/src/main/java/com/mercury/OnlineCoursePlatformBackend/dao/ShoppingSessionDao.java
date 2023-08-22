package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.ShoppingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ShoppingSessionDao extends JpaRepository<ShoppingSession, Integer> {
    public Optional<ShoppingSession> findByUserId(int userId);

}
