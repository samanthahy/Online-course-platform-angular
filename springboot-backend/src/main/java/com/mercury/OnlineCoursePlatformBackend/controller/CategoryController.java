package com.mercury.OnlineCoursePlatformBackend.controller;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Category;
import com.mercury.OnlineCoursePlatformBackend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryService.getCategories();
    }
}
