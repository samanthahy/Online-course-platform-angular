package com.mercury.OnlineCoursePlatformBackend.http.response;

import com.mercury.OnlineCoursePlatformBackend.model.bean.ProfileImage;

public class UploadProfileImageResponse extends Response {
    private ProfileImage profileImage;

    public UploadProfileImageResponse(boolean success, int code, String message, ProfileImage profileImage) {
        super(success, code, message);
        this.profileImage = profileImage;
    }

    public UploadProfileImageResponse(boolean success, String message) {
        super(success, message);
    }

    public ProfileImage getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(ProfileImage profileImage) {
        this.profileImage = profileImage;
    }
}
