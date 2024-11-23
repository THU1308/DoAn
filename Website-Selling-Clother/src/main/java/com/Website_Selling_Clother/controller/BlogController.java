package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.BlogDTO;
import com.Website_Selling_Clother.entity.Blog;
import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.service.Imp.BlogService;
import com.Website_Selling_Clother.service.Imp.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/blog")
public class BlogController {

    @Autowired
    BlogService blogService;

    @Autowired
    ImageService imageService;

    @GetMapping("")
    public ResponseData<List<BlogDTO>> getListBlog(){
        List<Blog> list = blogService.getList();
        List<BlogDTO> blogDTOList = new ArrayList<>();
        for (var item:list) {
            BlogDTO blogDTO = BlogDTO.fromBlog(item);
            blogDTOList.add(blogDTO);
        }
        return new ResponseData<>(HttpStatus.OK,"Success",blogDTOList);

    }

    @GetMapping("/{id}")
    public ResponseData<BlogDTO> getBlog(@PathVariable int id){

        Blog blog = null;
        try {
            blog = blogService.getBlogById(id);
            return new ResponseData<>(HttpStatus.OK,"Success",BlogDTO.fromBlog(blog));
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Fail!");
        }
    }

    @GetMapping("/newest")
    public ResponseEntity<?> getListNewest(@RequestParam int limit){
        List<Blog> list = blogService.getListBlogNew(limit);
        List<BlogDTO> blogDTOList = new ArrayList<>();
        for (var item:list) {
            BlogDTO blogDTO = BlogDTO.fromBlog(item);
            blogDTOList.add(blogDTO);
        }
        return ResponseEntity.ok(blogDTOList);
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<String> create(@RequestBody BlogDTO blogDTO){
        Blog blog = null;
        try {
            blog = blogService.createBlog(blogDTO);
            return new ResponseData<>(HttpStatus.OK,"Success");
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<String> update(@PathVariable int id, @RequestBody BlogDTO blogDTO){
        Blog blog = null;
        try {
            blog = blogService.updateBlogById(id,blogDTO);
            return new ResponseData<>(HttpStatus.OK,"Success","Success");
        } catch (DataNotFoundException e) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST,e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<String> delete(@PathVariable int id){
        try {
            blogService.deleteBlog(id);
            return new ResponseData<>(HttpStatus.OK,"Success");
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,e.getMessage());
        }
    }
}
