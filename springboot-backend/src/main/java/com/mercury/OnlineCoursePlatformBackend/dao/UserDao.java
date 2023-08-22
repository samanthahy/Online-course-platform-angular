package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.model.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {

    User findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);


    @Query("SELECT u FROM User u WHERE u.username LIKE %:filter% OR u.email LIKE %:filter%")
    Page<User> findUsersWithFilter(@Param("filter") String filter, Pageable pageable);


/*    @Query("SELECT u FROM User u JOIN u.profile p ORDER BY p.role")
    Page<User> findAllSortedByRole(Pageable pageable);*/

    @Query("SELECT u FROM User u JOIN u.profile p ORDER BY p.role")
    Page<User> findAllSortedByProfileRole(Pageable pageable);


    @Query("SELECT u FROM User u JOIN u.profile p WHERE LOWER(p.role) LIKE LOWER(CONCAT('%', :filter, '%')) ORDER BY p.role")
    Page<User> findAllFilteredAndSortedByRole(@Param("filter") String filter, Pageable pageable);

}

