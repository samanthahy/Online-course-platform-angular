package com.mercury.OnlineCoursePlatformBackend.controller;


import com.mercury.OnlineCoursePlatformBackend.http.request.CreateOrderRequest;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Order;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.OrderCourse;
import com.mercury.OnlineCoursePlatformBackend.model.dto.UserDTO;
import com.mercury.OnlineCoursePlatformBackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;


    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable int id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/userId/{userId}")
    public List<Order> getOrdersByUser(@PathVariable int userId) {
        return orderService.getOrdersByUser(userId);
    }



    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(params = "sort")
    public Page<Order> getOrdersWithFilterSortPaginator(
            @RequestParam(defaultValue = "purchaseDate") String sort,
            @RequestParam(defaultValue = "ASC") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter) {
        return orderService.getOrdersWithFilterSortPaginator(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order), sort)), filter);
    }


/*    @PostMapping
    public Response save(@RequestBody Order order) {
        return orderService.save(order);
    }*/

    @PostMapping
    public Order create(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request.getSessionId(), request.getPaymentType());
    }



    @PutMapping
    public Response update(@RequestBody Order order) {
        return orderService.edit(order);
    }

    @DeleteMapping("/{id}")
    public Response delete(@PathVariable int id) {
        System.out.println("Order: " + id + " is fake deleted!");
        return new Response(true, "Order: " + id + " is fake deleted!");
    }
}
