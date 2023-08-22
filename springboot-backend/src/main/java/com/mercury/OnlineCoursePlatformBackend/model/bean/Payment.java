package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;


import java.util.Date;
@Entity
@Table(name="CP_PAYMENT")
public class Payment {

    @Id
    @SequenceGenerator(name = "cp_payment_seq_gen", sequenceName = "CP_PAYMENT_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_payment_seq_gen", strategy = GenerationType.AUTO)
    private int id;


    @Column(name = "user_id")
    private int userId;

    @Column(name = "name_on_card")
    private String nameOnCard;

    @Column(name = "account_no")
    private String accountNo;
    private Date expiry;

    public Payment() {
    }

    public Payment(int id, int userId, String nameOnCard, String accountNo, Date expiry) {
        this.id = id;
        this.userId = userId;
        this.nameOnCard = nameOnCard;
        this.accountNo = accountNo;
        this.expiry = expiry;
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

    public String getNameOnCard() {
        return nameOnCard;
    }

    public void setNameOnCard(String nameOnCard) {
        this.nameOnCard = nameOnCard;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public Date getExpiry() {
        return expiry;
    }

    public void setExpiry(Date expiry) {
        this.expiry = expiry;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "id=" + id +
                ", userId=" + userId +
                ", nameOnCard='" + nameOnCard + '\'' +
                ", accountNo='" + accountNo + '\'' +
                ", expiry=" + expiry +
                '}';
    }
}
