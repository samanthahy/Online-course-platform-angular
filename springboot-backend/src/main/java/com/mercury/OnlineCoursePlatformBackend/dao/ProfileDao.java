package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileDao extends JpaRepository<Profile, Integer> {
    Profile findByRole(String profileRole);
}
