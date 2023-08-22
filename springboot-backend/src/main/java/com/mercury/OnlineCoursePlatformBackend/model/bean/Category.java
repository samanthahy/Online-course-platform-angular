package com.mercury.OnlineCoursePlatformBackend.model.bean;


import jakarta.persistence.*;

@Entity
@Table(name = "CP_CATEGORY")
public class Category {

    @Id
    @SequenceGenerator(name = "cp_category_seq_gen", sequenceName = "CP_CATEGORY_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_category_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;
    private String path;
    private String name;

    public Category(int id, String path, String name) {
        this.id = id;
        this.path = path;
        this.name = name;
    }

    public Category() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", path='" + path + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
