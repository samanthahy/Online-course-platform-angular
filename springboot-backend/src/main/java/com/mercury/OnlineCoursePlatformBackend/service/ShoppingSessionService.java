package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.model.bean.*;
import com.mercury.OnlineCoursePlatformBackend.dao.CartItemDao;
import com.mercury.OnlineCoursePlatformBackend.dao.CourseDao;
import com.mercury.OnlineCoursePlatformBackend.dao.ShoppingSessionDao;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CartItem;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ShoppingSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShoppingSessionService {
    @Autowired
    private ShoppingSessionDao shoppingSessionDao;

    @Autowired
    private CourseDao courseDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CartItemDao cartItemDao;


    public List<ShoppingSession> getAll() {
        return shoppingSessionDao.findAll();
    }


    public ShoppingSession getShoppingSessionById(Integer id) {
        return shoppingSessionDao.findById(id).get();
    }


    public ShoppingSession getShoppingSessionByUserId(int userId) {
        // Try to get the existing ShoppingSession
        Optional<ShoppingSession> existingSession = shoppingSessionDao.findByUserId(userId);


        // If the ShoppingSession exists, return it
        if (existingSession.isPresent()) {
            return existingSession.get();
        }

        // If the ShoppingSession does not exist, create a new one
        ShoppingSession newSession = createShoppingSession(userId);
        return newSession;
    }


    public ShoppingSession createShoppingSession(int userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        ShoppingSession session = new ShoppingSession();
        session.setUserId(userId);
        session.setTotal(0.0);
        session.setCartItems(new ArrayList<>());

        shoppingSessionDao.save(session);
        return session;
    }



    @Transactional(isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRED)
    public Response save(ShoppingSession shoppingSession) {
        // Spring transaction will automatically roll back if exception out.
        try {
            List<CartItem> cartItems = shoppingSession.getCartItems();
            cartItems.forEach((cartItem) -> {
                // enrich the course object
                Course course = (Course) courseDao.findById(cartItem.getCourse().getId()).get();
                // establishes the relationship from the OrderCourse side
                cartItem.setCourse(course);
            });

            //orderHistoryDao.save(order);
            shoppingSessionDao.save(shoppingSession);

            return new Response(true);
        } catch (Exception e) {
            return new Response(false);
        }
    }

    public Response edit(ShoppingSession shoppingSession) {
        try {
            ShoppingSession session = (ShoppingSession) shoppingSessionDao.findById(shoppingSession.getId()).get();

            List<CartItem> cartItemsToRemove = session.getCartItems();

            List<CartItem> cartItems = shoppingSession.getCartItems();
            // handled update and add courses in order
            cartItems.forEach((cartItem) -> {
                Course course = (Course) courseDao.findById(cartItem.getCourse().getId()).get();
                cartItem.setCourse(course);
            });

            // handle remove courses in order
            if(cartItems.size() > 0) {
                cartItemsToRemove = cartItemsToRemove.stream().filter((cartItem) -> {
                    return !cartItems.contains(cartItem);
                }).collect(Collectors.toList());
            }

            session.setCartItems(cartItems);

            shoppingSessionDao.save(session);

            deleteCartItems(cartItemsToRemove);

            return new Response(true);
        } catch (Exception e) {
            System.out.println(e);
            return new Response(false);
        }
    }



    public void deleteCartItems(List<CartItem> cartItems) {
        cartItemDao.deleteAll(cartItems);
    }



}