package com.mercury.OnlineCoursePlatformBackend.http.response;

import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.model.dto.UserDTO;

public class JwtAuthenticationResponse extends Response {

    private UserDTO userDTO;
    private String token;
    private String type = "Bearer";

    public JwtAuthenticationResponse(boolean success, int code, String message, UserDTO userDTO, String token) {
        super(success, code, message);
        this.userDTO = userDTO;
        this.token = token;
    }

    public UserDTO getUserDTO() {
        return userDTO;
    }

    public void setUserDTO(UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
