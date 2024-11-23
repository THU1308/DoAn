package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.CategoryDTO;
import com.Website_Selling_Clother.entity.Category;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.service.Imp.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/category")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @GetMapping("")
    public ResponseData<List<Category>> getCategories(){
        return new ResponseData<>(HttpStatus.OK,"Success",categoryService.findAll());
    }

    @GetMapping("/enable")
    public ResponseEntity<?> getCategoriesEnable(){
        return ResponseEntity.ok(categoryService.getListEnabled());
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<Category> createCategory(@RequestBody CategoryDTO categoryDTO){
        Category category = categoryService.createCategory(categoryDTO);
        return new ResponseData<>(HttpStatus.OK,"Success",category);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<Boolean> updateCategoryById(@PathVariable int id, @RequestBody CategoryDTO categoryDTO){
            boolean isSuccess = categoryService.updateCategory(id,categoryDTO);
            return new ResponseData<>(HttpStatus.OK,"Success",isSuccess);
    }

    @PutMapping("/enable/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYEE')")
    @Transactional
    public ResponseData<String> enableById(@PathVariable int id){
        categoryService.enableCategory(id);
        return new ResponseData<>(HttpStatus.OK,"Success");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<String> deleteCategoryById(@PathVariable int id){
        try {
            categoryService.deleteCategory(id);
            return new ResponseData<>(HttpStatus.OK,("Xóa thành công category id: " + id));
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.OK,e.getMessage());
        }
    }


}
