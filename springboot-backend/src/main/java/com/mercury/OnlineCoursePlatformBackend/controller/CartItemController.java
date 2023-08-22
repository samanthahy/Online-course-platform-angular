package com.mercury.OnlineCoursePlatformBackend.controller;


import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CartItem;
import com.mercury.OnlineCoursePlatformBackend.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart_items")
public class CartItemController {
    @Autowired
    private CartItemService cartItemService;


    @GetMapping("/sessionId/{sessionId}")
    public List<CartItem> getByShoppingSessionId(@PathVariable int sessionId) {
        return cartItemService.getByShoppingSessionId(sessionId);
    }


    @GetMapping("/sessionId/{sessionId}/cart_count")
    public int getCartCountByShoppingSessionId(@PathVariable int sessionId) {
        return cartItemService.getCartCountByShoppingSessionId(sessionId);
    }



    @PostMapping("/sessionId/{sessionId}")
    public Response addCartItem(@RequestBody CartItem cartItem, @PathVariable int sessionId) {
        return cartItemService.addCartItem(cartItem, sessionId);
    }

    @DeleteMapping("/sessionId/{sessionId}/courseId/{courseId}")
    public Response deleteCartItem(@PathVariable("sessionId") int sessionId, @PathVariable("courseId") int courseId) {
        return cartItemService.deleteCartItem(sessionId, courseId);
    }


}
