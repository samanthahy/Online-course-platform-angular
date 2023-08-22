package com.mercury.OnlineCoursePlatformBackend.controller;


import com.mercury.OnlineCoursePlatformBackend.http.request.UpdateProfileRequest;
import com.mercury.OnlineCoursePlatformBackend.http.response.UserInfoResponse;
import com.mercury.OnlineCoursePlatformBackend.model.bean.UserInfo;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/user-details")
public class UserInfoController {

    private static final Logger logger = LoggerFactory.getLogger(UserInfoController.class);

    @Autowired
    private UserInfoService userInfoService;

    @GetMapping("/userId/{userId}")
    public UserInfo getUserDetailByUserId(@PathVariable int userId) {
        return userInfoService.getUserInfoByUserId(userId);
    }

/*    @PostMapping
    public Response postUserDetails(@RequestBody UserInfo userInfo,
                                    Authentication authentication) {

        return userInfoService.addUserInfo(userInfo, authentication);

    }*/

    @PutMapping("/updateProfile/userId/{userId}")
    public UserInfo putProfile(@RequestBody UpdateProfileRequest uploadProfileRequest, @PathVariable("userId") int userId) {
        return userInfoService.updateProfile(uploadProfileRequest, userId);
    }


    @PutMapping(value = "/updateProfileImage/userId/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserInfo updateProfileImage(@PathVariable("userId") int userId, @RequestParam("file") MultipartFile file) {
        try {
            return userInfoService.updateProfileImage(userId, file);
        } catch (Exception e) {
            logger.error("Error while updating profile image", e);
            return null;
        }
    }



}
