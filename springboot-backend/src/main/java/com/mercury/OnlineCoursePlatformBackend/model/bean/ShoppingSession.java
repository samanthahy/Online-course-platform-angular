package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "CP_SHOPPING_SESSION")
public class ShoppingSession {
    @Id
    @SequenceGenerator(name = "cp_shopping_session_seq_gen", sequenceName = "CP_SHOPPING_SESSION_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_shopping_session_seq_gen", strategy = GenerationType.AUTO)
    private int id;
    private int userId;
    private double total;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "shoppingSession")
    private List<CartItem> cartItems;

    public ShoppingSession() {
    }


    public ShoppingSession(int id, int userId, double total, List<CartItem> cartItems) {
        this.id = id;
        this.userId = userId;
        this.total = total;
//        this.cartItems = cartItems;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    @Override
    public String toString() {
        return "ShoppingSession{" +
                "id=" + id +
                ", userId=" + userId +
                ", total=" + total +
                ", cartItems=" + cartItems +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShoppingSession that = (ShoppingSession) o;
        return id == that.id && userId == that.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId);
    }
}


