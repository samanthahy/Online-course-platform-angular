package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "CP_USER_DETAIL")
public class UserInfo {

    @Id
    @SequenceGenerator(name="cp_user_detail_seq_gen", sequenceName = "CP_USER_DETAIL_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_user_detail_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;
    private String firstname;
    private String lastname;
    private String phone;
    private String overview;
    private String description;
    private String personalLink;

    @OneToOne
    @JoinColumn(name = "image_id")
    private ProfileImage profileImage;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToOne
    @JoinColumn(name = "payment_id")
    @JsonIgnore
    private Payment payment;

    public UserInfo() {
    }

    public UserInfo(int id, String firstname, String lastname, String phone, String overview, String description, String personalLink, ProfileImage profileImage, User user, Payment payment) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.overview = overview;
        this.description = description;
        this.personalLink = personalLink;
        this.profileImage = profileImage;
        this.user = user;
        this.payment = payment;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public ProfileImage getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(ProfileImage profileImage) {
        this.profileImage = profileImage;
    }

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

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }



    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @JsonIgnore
    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
                "id=" + id +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", phone='" + phone + '\'' +
                ", overview='" + overview + '\'' +
                ", description='" + description + '\'' +
                ", personalLink='" + personalLink + '\'' +
                ", profileImage=" + profileImage +
                ", user=" + user +
                ", payment=" + payment +
                '}';
    }
}
