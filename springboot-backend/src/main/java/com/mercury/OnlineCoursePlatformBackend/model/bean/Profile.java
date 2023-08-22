package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.security.core.GrantedAuthority;

import java.util.Objects;

@Entity
@Table(name = "CP_PROFILE")
public class Profile implements GrantedAuthority {
    @Id
    private int id;
    private String role;

    public Profile() {
    }

    public Profile(int id) {
        this.id = id;
    }

    public Profile(int id, String role) {
        this.id = id;
        this.role = role;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "Profile{" +
                "id=" + id +
                ", role='" + role + '\'' +
                '}';
    }


    @Override
    public String getAuthority() {
        return role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Profile profile = (Profile) o;
        return id == profile.id && role.equals(profile.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, role);
    }
}
