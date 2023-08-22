package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Order;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface OrderDao extends JpaRepository<Order, Integer> {


/*    @Query(value = "SELECT * FROM CP_ORDER o WHERE o.order_number LIKE :filter OR CAST(o.purchase_date AS VARCHAR) LIKE :filter", nativeQuery = true)
    Page<Order> findOrdersWithFilter(@Param("filter") String filter, Pageable pageable);*/


    @Query("SELECT o FROM Order o WHERE " +
            "(o.purchaseDate >= :startDate AND o.purchaseDate < :endDate) OR " +
            "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Order> findOrdersWithFilter(@Param("filter") String filter,
                                     @Param("startDate") Date startDate,
                                     @Param("endDate") Date endDate,
                                     Pageable pageable);



    List<Order> findByUserId(int userId);
}
