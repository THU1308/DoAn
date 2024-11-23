package com.Website_Selling_Clother.dto;


import com.Website_Selling_Clother.entity.Blog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {

    private int id;

    private String title;

    private String description;

    private String content;

    private Date createAt;

    private int imageId;

    private String username;

    private Set<Integer> tags;

    public static BlogDTO fromBlog(Blog blog){
        BlogDTO blogDTO = new BlogDTO();
        blogDTO.setId(blog.getId());
        blogDTO.setTitle(blog.getTitle());
        blogDTO.setDescription(blog.getDescription());
        blogDTO.setContent(blog.getContent());
        blogDTO.setCreateAt(blog.getCreateAt());
        blogDTO.setImageId(blog.getImage().getId());
        blogDTO.setUsername(blog.getUser().getUsername());
        Set<Integer> listTag = new HashSet<>();
        if(!blog.getTags().isEmpty()){
            for (var item:blog.getTags()) {
                listTag.add((int) item.getId());
            }
            blogDTO.setTags(listTag);
        }
        return blogDTO;
    }
}
