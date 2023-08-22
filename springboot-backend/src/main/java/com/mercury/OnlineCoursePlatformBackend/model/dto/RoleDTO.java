package com.mercury.OnlineCoursePlatformBackend.model.dto;

public class RoleDTO {
    private UserDTO userDTO;
    private String role;

    public RoleDTO() {
    }

    public RoleDTO(UserDTO userDTO, String role) {
        this.userDTO = userDTO;
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserDTO getUserDTO() {
        return userDTO;
    }

    public void setUserDTO(UserDTO userDTO) {
        this.userDTO = userDTO;
    }
}
