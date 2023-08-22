package com.mercury.OnlineCoursePlatformBackend.controller;

import com.mercury.OnlineCoursePlatformBackend.model.bean.ShoppingSession;
import com.mercury.OnlineCoursePlatformBackend.service.ShoppingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shopping_sessions")
public class ShoppingSessionController {

    @Autowired
    private ShoppingSessionService shoppingSessionService;


/*    @PostMapping("/shopping_session")
    public ResponseEntity<ShoppingSession> createShoppingSession(@RequestBody int userId) {
        ShoppingSession session = shoppingSessionService.createShoppingSession(userId);
        return new ResponseEntity<>(session, HttpStatus.CREATED);
    }*/

    @GetMapping("/userId/{userId}")
    public ShoppingSession getShoppingSessionByUserId(@PathVariable("userId") int userId) {
        return shoppingSessionService.getShoppingSessionByUserId(userId);
    }



}
