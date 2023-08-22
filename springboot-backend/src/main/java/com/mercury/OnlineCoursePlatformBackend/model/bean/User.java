package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mercury.OnlineCoursePlatformBackend.config.SimpleGrantedAuthorityDeserializer;
import com.mercury.OnlineCoursePlatformBackend.util.Views;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "CP_USER")
public class User implements UserDetails {
    @Id
    @SequenceGenerator(name="cp_user_seq_gen", sequenceName = "CP_USER_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_user_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String username;

    @NotBlank
    private String email;

    @NotBlank
    private String password;


    @Column(name = "joined_date")
    private Date joinedDate;

    private String status;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinTable(
            name = "CP_USER_PROFILE",
            joinColumns = {
                    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "PROFILE_ID", referencedColumnName = "ID")
            }
    )
    private Profile profile;
//    private List<Profile> profiles;


    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinTable(
            name = "CP_WISHLIST",
            joinColumns = {
                    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "COURSE_ID", referencedColumnName = "ID")
            }
    )
    private List<Course> wishlistCourses;

    public User() {
    }


    public User(String username, String email,  String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

/*    public User(int id, String username, String email, String password, Date joinedDate, String status, List<Profile> profiles, List<Course> wishlistCourses) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.joinedDate = joinedDate;
        this.status = status;
        this.profiles = profiles;
        this.wishlistCourses = wishlistCourses;
    }*/


    public User(int id, String username, String email, String password, Date joinedDate, String status, Profile profile, List<Course> wishlistCourses) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.joinedDate = joinedDate;
        this.status = status;
        this.profile = profile;
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

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

/*    @Override
    @JsonDeserialize(using = SimpleGrantedAuthorityDeserializer.class)
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return profiles
                .stream()
                .map(profile -> new SimpleGrantedAuthority(profile.getRole()))
                .collect(Collectors.toList());
    }*/

    @Override
    @JsonDeserialize(using = SimpleGrantedAuthorityDeserializer.class)
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(profile.getRole()));
    }



    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


/*    public List<Profile> getProfiles() {
        return profiles;
    }

    public void setProfiles(List<Profile> profiles) {
        this.profiles = profiles;
    }*/


    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
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

    @JsonIgnore
    public List<Course> getWishlistCourses() {
        return wishlistCourses;
    }

    public void setWishlistCourses(List<Course> wishlistCourses) {
        this.wishlistCourses = wishlistCourses;
    }

/*    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", joinedDate=" + joinedDate +
                ", status='" + status + '\'' +
                ", profiles=" + profiles +
                ", wishlistCourses=" + wishlistCourses +
                '}';
    }*/


    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", joinedDate=" + joinedDate +
                ", status='" + status + '\'' +
                ", profile=" + profile +
                ", wishlistCourses=" + (wishlistCourses != null ? wishlistCourses.stream()
                .map(course -> course.getId() + "-" + course.getName())
                .collect(Collectors.toList()) : null) +
                '}';
    }
}
