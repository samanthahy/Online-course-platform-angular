package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoDao extends JpaRepository<UserInfo, Integer> {

    @Query("SELECT u FROM UserInfo u WHERE u.user.id = :userId")
    UserInfo findByUserId(@Param("userId") int id);


}
