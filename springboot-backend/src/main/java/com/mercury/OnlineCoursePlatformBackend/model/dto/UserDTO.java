package com.mercury.OnlineCoursePlatformBackend.model.dto;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;

import java.util.Date;
import java.util.List;

public class UserDTO {
    private int id;
    private String username;
    private String email;
    private String password;
    private Date joinedDate;

    private String status;
    private String role;
    private List<Course> wishlistCourses;

    public UserDTO() {
    }


    public UserDTO(int id, String username, String email, String password, Date joinedDate, String status, String role, List<Course> wishlistCourses) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.joinedDate = joinedDate;
        this.status = status;
        this.role = role;
        this.wishlistCourses = wishlistCourses;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(Date joinedDate) {
        this.joinedDate = joinedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

/*    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }*/


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Course> getWishlistCourses() {
        return wishlistCourses;
    }

    public void setWishlistCourses(List<Course> wishlistCourses) {
        this.wishlistCourses = wishlistCourses;
    }
}
