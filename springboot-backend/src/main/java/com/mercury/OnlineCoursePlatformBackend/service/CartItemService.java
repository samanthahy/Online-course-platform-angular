package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.dao.CartItemDao;
import com.mercury.OnlineCoursePlatformBackend.dao.CourseDao;
import com.mercury.OnlineCoursePlatformBackend.dao.ShoppingSessionDao;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CartItem;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ShoppingSession;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartItemService {
    private static final Logger logger = LoggerFactory.getLogger(CartItemService.class);

    @Autowired
    private CartItemDao cartItemDao;

    @Autowired
    private ShoppingSessionDao shoppingSessionDao;

    @Autowired
    private CourseDao courseDao;

    @Autowired
    private EntityManager entityManager;


    public double calculateTotal(ShoppingSession shoppingSession) {
        List<CartItem> cartItems = shoppingSession.getCartItems();
        double total = 0;
        for (CartItem cartItem : cartItems) {
            total += cartItem.getCourse().getPrice();
        }
        return total;
    }


    @Transactional
    public Response addCartItem(CartItem cartItem, int sessionId) {
        Optional<ShoppingSession> shoppingSessionOptional = shoppingSessionDao.findById(sessionId);
        if (!shoppingSessionOptional.isPresent()) {
            return new Response(false, "Shopping session not found");
        }
        ShoppingSession shoppingSession = shoppingSessionOptional.get();

        // Logic to check if the cart item already exists
        Optional<CartItem> existingCartItem = cartItemDao.findByShoppingSessionAndCourse(shoppingSession, cartItem.getCourse());
        if (existingCartItem.isPresent()) {
            return new Response(false, "the item already exists");
        }

        // If the item does not exist, save the new item
        CartItem newCartItem = new CartItem();
        newCartItem.setCourse(cartItem.getCourse());
        shoppingSession.getCartItems().add(newCartItem);
        newCartItem.setShoppingSession(shoppingSession);
        cartItemDao.save(newCartItem);

        // Update the total value of the shopping session
        double newTotal = calculateTotal(shoppingSession);
        shoppingSession.setTotal(newTotal);
        shoppingSessionDao.save(shoppingSession);

        return new Response(true, 200, "successfully add to the cart");
    }


    @Transactional
    public Response deleteCartItem(int sessionId, int courseId) {
        Optional<ShoppingSession> shoppingSessionOptional = shoppingSessionDao.findById(sessionId);
        Optional<Course> courseOptional = courseDao.findById(courseId);

        if (!shoppingSessionOptional.isPresent()) {
            return new Response(false, "Shopping Session not found");
        }

        if (!courseOptional.isPresent()) {
            return new Response(false, "Course not found");
        }

        ShoppingSession shoppingSession = shoppingSessionOptional.get();
        Course course = courseOptional.get();

        Optional<CartItem> cartItemOptional = cartItemDao.findByShoppingSessionAndCourse(shoppingSession, course);

        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get();

            shoppingSession.getCartItems().remove(cartItem);  // <-- Remove the CartItem from the ShoppingSession
            cartItemDao.delete(cartItem);  // <-- Explicitly delete the CartItem

            // flush the changes and refresh the ShoppingSession
            cartItemDao.flush();
            entityManager.refresh(shoppingSession);

            // Calculate total after cart item removal
            double newTotal = calculateTotal(shoppingSession);
            shoppingSession.setTotal(newTotal);
            shoppingSessionDao.save(shoppingSession);

            return new Response(true,  "Cart item removed successfully");
        } else {
            return new Response(false, "Cart item not found");
        }

    }



    public List<CartItem> getByShoppingSessionId(int sessionId) {
        Optional<ShoppingSession> shoppingSessionOptional = shoppingSessionDao.findById(sessionId);
        return shoppingSessionOptional.map(ShoppingSession::getCartItems).orElseGet(ArrayList::new);
    }



    public int getCartCountByShoppingSessionId(int sessionId) {
        int cartCount = getByShoppingSessionId(sessionId).size();
        return cartCount;
    }


}
