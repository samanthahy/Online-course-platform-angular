package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.http.request.UpdateProfileRequest;
import com.mercury.OnlineCoursePlatformBackend.http.response.UploadProfileImageResponse;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ProfileImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.model.bean.UserInfo;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.dao.UserInfoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;


@Service
public class UserInfoService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private UserInfoDao userInfoDao;

    @Autowired
    private S3Service s3Service;

    public UserInfo getUserInfo( int userInfoId) {
        Optional<UserInfo> userInfoOptional = userInfoDao.findById(userInfoId);

        if (userInfoOptional.isPresent()) {
            return userInfoOptional.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Info Not Found");
        }
    }

    public UserInfo getUserInfoByUserId(int userId) {
        return userInfoDao.findByUserId(userId);
    }

    public UserInfo createUserInfo(User user, String fullname) {
        String firstName = fullname.split(" ")[0];
        String lastName = fullname.split(" ")[1];
        UserInfo userInfo = new UserInfo();
        userInfo.setUser(user);
        userInfo.setFirstname(firstName);
        userInfo.setLastname(lastName);
        userInfoDao.save(userInfo);
        return userInfo;
    }


    public UserInfo updateProfile(UpdateProfileRequest updateProfileRequest, int userId) {
        UserInfo userInfo = userInfoDao.findByUserId(userId);
        if(userInfo == null){
            throw new IllegalArgumentException("User not found");
        }
        userInfo.setFirstname(updateProfileRequest.getFirstname());
        userInfo.setLastname(updateProfileRequest.getLastname());
        userInfo.setPhone(updateProfileRequest.getPhone());
        userInfo.setOverview(updateProfileRequest.getOverview());
        userInfo.setDescription(updateProfileRequest.getDescription());
        userInfo.setPersonalLink(updateProfileRequest.getPersonalLink());
        return userInfoDao.save(userInfo);
    }


    public UserInfo updateProfileImage(int userId, MultipartFile file) {
        UserInfo userInfo = userInfoDao.findByUserId(userId);
        if (userInfo != null) {

            // Call uploadProfileFile in UploadService.
            ProfileImage profileImage = s3Service.uploadProfileImage(file, userId);

            userInfo.setProfileImage(profileImage);
            userInfoDao.save(userInfo);
            return userInfo;
        } else {
            throw new RuntimeException("User not found with id " + userId);
        }

    }

}
