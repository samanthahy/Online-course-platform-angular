package com.mercury.OnlineCoursePlatformBackend.controller;

import com.mercury.OnlineCoursePlatformBackend.http.request.LoginRequest;
import com.mercury.OnlineCoursePlatformBackend.http.request.RegisterRequest;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Response login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }



/*    @GetMapping("/checklogin")
    public Response checklogin(Authentication authentication) {
        return authService.checklogin(authentication);
    }*/
}
