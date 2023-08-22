package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "CP_DISCOUNT")
public class Discount {
    @Id
    @SequenceGenerator(name="cp_discount_seq_gen", sequenceName = "CP_DISCOUNT_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_discount_seq_gen", strategy = GenerationType.AUTO)
    private int id;
    private Timestamp startTime;
    private Timestamp endTime;
    private String name;
    private String description;
    private double discountPercent;

    public Discount() {
    }

    public Discount(int id, String name, String description, double discountPercent) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.discountPercent = discountPercent;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(double discountPercent) {
        this.discountPercent = discountPercent;
    }

    @Override
    public String toString() {
        return "Discount{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", discountPercent=" + discountPercent +
                '}';
    }
}
