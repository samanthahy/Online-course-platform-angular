package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;


@Entity
@Table(name = "CP_ORDER")
public class Order {
    @Id
    @SequenceGenerator(name = "cp_order_seq_gen", sequenceName = "CP_ORDER_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_order_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;
    private Date purchaseDate;
    private int userId;
    private double total;
    private String orderNumber;
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderCourse> purchases;
    @Column(name = "payment_type")
    private String paymentType;

    public Order() {
    }

    public Order(int id, Date purchaseDate, int userId, double total, String orderNumber, List<OrderCourse> purchases, String paymentType) {
        this.id = id;
        this.purchaseDate = purchaseDate;
        this.userId = userId;
        this.total = total;
        this.orderNumber = orderNumber;
        this.purchases = purchases;
        this.paymentType = paymentType;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
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

    public List<OrderCourse> getPurchases() {
        return purchases;
    }

    public void setPurchases(List<OrderCourse> purchases) {
        this.purchases = purchases;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }


    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", purchaseDate=" + purchaseDate +
                ", userId=" + userId +
                ", total=" + total +
                ", orderNumber='" + orderNumber + '\'' +
                ", purchases=" + purchases +
                ", paymentType='" + paymentType + '\'' +
                '}';
    }
}
