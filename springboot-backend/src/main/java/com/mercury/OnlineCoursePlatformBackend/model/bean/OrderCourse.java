package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name="CP_ORDER_COURSE")
public class OrderCourse {
    @Id
    @SequenceGenerator(name = "cp_order_course_seq_gen", sequenceName = "CP_ORDER_COURSE_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_order_course_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    private Course course;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    private Order order;
    @Column(name = "selling_price")
    private Double sellingPrice;

    public OrderCourse() {
    }

    public OrderCourse(int id, Course course, Order order, Double sellingPrice) {
        this.id = id;
        this.course = course;
        this.order = order;
        this.sellingPrice = sellingPrice;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    @JsonIgnore
    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(Double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    @Override
    public String toString() {
        return "OrderCourse{" +
                "id=" + id +
                ", course=" + course +
                ", order=" + order +
                ", sellingPrice=" + sellingPrice +
                '}';
    }
}
