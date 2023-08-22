package com.mercury.OnlineCoursePlatformBackend.http.request;

public class UpdateProfileRequest {
    private String firstname;
    private String lastname;
    private String phone;
    private String overview;
    private String description;
    private String personalLink;

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPersonalLink() {
        return personalLink;
    }

    public void setPersonalLink(String personalLink) {
        this.personalLink = personalLink;
    }
}
