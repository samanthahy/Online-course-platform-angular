package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "CP_CART_ITEM")
public class CartItem {

    @Id
    @SequenceGenerator(name = "cp_cart_item_seq_gen", sequenceName = "CP_CART_ITEM_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_cart_item_seq_gen", strategy = GenerationType.AUTO)
    private int id;


    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name="shopping_session_id", nullable=false)
    private ShoppingSession shoppingSession;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    private Course course;

    public CartItem() {
    }

    public CartItem(int id, ShoppingSession shoppingSession, Course course) {
        this.id = id;
        this.shoppingSession = shoppingSession;
        this.course = course;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    @JsonIgnore
    public ShoppingSession getShoppingSession() {
        return shoppingSession;
    }

    public void setShoppingSession(ShoppingSession shoppingSession) {
        this.shoppingSession = shoppingSession;

    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", shoppingSession=" + shoppingSession +
                ", course=" + course +
                '}';
    }
}
