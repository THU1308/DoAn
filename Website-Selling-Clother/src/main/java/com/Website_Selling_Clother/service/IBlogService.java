package com.Website_Selling_Clother.service;

import com.Website_Selling_Clother.dto.BlogDTO;
import com.Website_Selling_Clother.entity.Blog;
import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;

public interface IBlogService {

    List<Blog> getList();

    List<Blog> getListBlogNew(int limit);

    Blog getBlogById(int id) throws DataNotFoundException;

    Blog createBlog(BlogDTO blogDTO) throws DataNotFoundException;

    Blog updateBlogById(int id,BlogDTO blogDTO) throws DataNotFoundException;

    void deleteBlog(int id) throws DataNotFoundException;
}
