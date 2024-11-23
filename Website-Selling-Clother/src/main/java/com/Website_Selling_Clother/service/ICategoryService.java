package com.Website_Selling_Clother.service;

import com.Website_Selling_Clother.dto.CategoryDTO;
import com.Website_Selling_Clother.entity.Category;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;

public interface ICategoryService {
    List<Category> findAll();

    List<Category> getListEnabled();

    Category createCategory(CategoryDTO categoryDTO);

    boolean updateCategory(int id,CategoryDTO categoryDTO) throws Exception;

    void enableCategory(int id);

    void deleteCategory(int id) throws DataNotFoundException;
}
