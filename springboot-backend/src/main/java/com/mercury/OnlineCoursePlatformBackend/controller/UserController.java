package com.mercury.OnlineCoursePlatformBackend.controller;

import com.mercury.OnlineCoursePlatformBackend.model.dto.UserDTO;
import org.springframework.data.domain.Page;
import com.fasterxml.jackson.annotation.JsonView;
import com.mercury.OnlineCoursePlatformBackend.http.request.RegisterRequest;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.dto.RoleDTO;
import com.mercury.OnlineCoursePlatformBackend.service.UserService;
import com.mercury.OnlineCoursePlatformBackend.util.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;



    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserDTO> getAll() {
        return userService.getAll();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("{id}")
    public UserDTO getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(params = "sort")
    public Page<UserDTO> getUsersWithFilterSortPaginator(
            @RequestParam(defaultValue = "email") String sort,
            @RequestParam(defaultValue = "ASC") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter) {
        return userService.getUsersWithFilterSortPaginator(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order), sort)), filter);
    }



    @PostMapping("/register")
    public Response register(@Valid @RequestBody RegisterRequest registerRequest) {
        return userService.register(registerRequest);
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('STUDENT','INSTRUCTOR','ADMIN')")
    public Response changeUser(@RequestBody User user, Authentication authentication) {
        return userService.changePassword(user, authentication);
    }

/*    @PostMapping("/add-role")
    @PreAuthorize("hasAnyRole('STUDENT','INSTRUCTOR','ADMIN')") // ensure the user is authenticated
    public Response addRoleToUser(@RequestBody RoleDTO roleDTO, Authentication authentication) {
        return userService.addRoleToUser(roleDTO.getRole(), authentication);
    }*/


    @PostMapping("/change-to-instructor")
    @PreAuthorize("hasRole('STUDENT')") // ensure the user is authenticated
    public Response changeToInstructorRole(@RequestBody String role, Authentication authentication) {
        return userService.changeToInstructorRole(role, authentication);
    }



    @PostMapping("/change-role")
    @PreAuthorize("hasRole('ADMIN')") // ensure the user is authenticated
    public Response changeRoleOfUser(@RequestBody UserDTO userDTO, Authentication authentication) {
        return userService.changeRoleOfUser(userDTO, authentication);
    }


    @PutMapping("/deactivate-user")
    @PreAuthorize("hasRole('ADMIN')") // ensure the user is authenticated
    public Response deactivateUser(@RequestBody UserDTO userDTO, Authentication authentication) {
        return userService.deactivateUser(userDTO, authentication);
    }


    @PutMapping("/activate-user")
    @PreAuthorize("hasRole('ADMIN')") // ensure the user is authenticated
    public Response activateUser(@RequestBody UserDTO userDTO, Authentication authentication) {
        return userService.activateUser(userDTO, authentication);
    }





/*    @PreAuthorize("hasRole('ADMIN')")*/
    @DeleteMapping("/delete/{id}")
    public Response deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }
}
