package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.CategoryDTO;
import com.Website_Selling_Clother.entity.Category;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.CategoryRepository;
import com.Website_Selling_Clother.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> getListEnabled() {
        return categoryRepository.findAllByEnable(true);
    }

    @Override
    public Category createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setEnable(true);
        categoryRepository.save(category);
        return category;
    }

    @Override
    public boolean updateCategory(int id, CategoryDTO categoryDTO){
        boolean isUpdate = false;
        Category category = null;
        try {
            category = categoryRepository.findById(id).orElseThrow();
            category.setName(categoryDTO.getName());
            categoryRepository.save(category);
            isUpdate = true;
        } catch (Exception e) {
            System.out.println("Error update category: " + e.getMessage());
        }
        return isUpdate;
    }

    @Override
    public void enableCategory(int id) {
        Category category = null;
        try {
            category = categoryRepository.findById(id).orElseThrow();
            if (category.isEnable()){
                category.setEnable(false);
            }else {
                category.setEnable(true);
            }
            categoryRepository.save(category);
        } catch (Exception e) {
            System.out.println("Error enable category: " + e.getMessage());
        }
    }

    @Override
    public void deleteCategory(int id) throws DataNotFoundException {
        Category category = null;
            category = categoryRepository.findById(id).orElseThrow(() ->new DataNotFoundException("Không thấy danh mục"));
            categoryRepository.delete(category);
    }
}
