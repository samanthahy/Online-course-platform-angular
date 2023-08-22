package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Profile;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.dao.ProfileDao;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.http.request.LoginRequest;
import com.mercury.OnlineCoursePlatformBackend.http.request.RegisterRequest;
import com.mercury.OnlineCoursePlatformBackend.http.response.JwtAuthenticationResponse;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.dto.UserDTO;
import com.mercury.OnlineCoursePlatformBackend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;




@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProfileDao profileDao;

    @Autowired
    PasswordEncoder passwordEncoder;

    public Response login(LoginRequest loginRequest) {
        System.out.println("Attempting to authenticate user: " + loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            // httpResponse.addHeader("Authentication", jwt);

            User user = (User) authentication.getPrincipal();

            String role = user.getAuthorities().iterator().next().getAuthority();

            System.out.println("###############################################3");
            System.out.println(user);


            UserDTO userDTO = new UserDTO() {};
            userDTO.setId(user.getId());
            userDTO.setUsername(user.getUsername());
            userDTO.setEmail(user.getEmail());
            userDTO.setPassword(user.getPassword());
            userDTO.setRole(role);
            userDTO.setWishlistCourses(user.getWishlistCourses());
            System.out.println("Authentication successful for user: " + loginRequest.getUsername());

            return new JwtAuthenticationResponse(true, 200, "Logged In!",userDTO,jwt);

        }catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + loginRequest.getUsername());
            e.printStackTrace();
            return new JwtAuthenticationResponse(false, 401, "Invalid username or password", null, null);
        } catch (Exception e) {
            System.out.println("Unexpected error during authentication for user: " + loginRequest.getUsername());
            e.printStackTrace();
            throw e;
        }

    }




/*    public Response checklogin(Authentication authentication) {
        if (authentication != null) {
            Response response = new AuthenticationSuccessJwtResponse(true, 200, "Logged In!", userDao.findByUsername(authentication.getName()),);
            return response;
        } else {
            return new Response(false);
        }
    }*/

}
