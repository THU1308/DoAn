package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.TagDTO;
import com.Website_Selling_Clother.entity.Tag;
import com.Website_Selling_Clother.service.Imp.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/tag")
public class TagController {

    @Autowired
    TagService tagService;

    @GetMapping("")
    public ResponseData<List<Tag>> getListTag(){
        return new ResponseData<>(HttpStatus.OK,"Success",tagService.getListTag());
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<Tag> createTag(@RequestBody TagDTO tagDTO){
        Tag tag = tagService.createTag(tagDTO);
        tag.setEnable(true);
        return new ResponseData<>(HttpStatus.OK,"Success",tag);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<Tag> updateTag(@PathVariable int id,@RequestBody TagDTO tagDTO){
        try {
            Tag tag = tagService.updateTag(id, tagDTO);
            return new ResponseData<>(HttpStatus.OK,"Success",tag);
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }

    @PutMapping("/enable/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<String> enabled(@PathVariable int id){
        try {
            tagService.enableTag(id);
            return new ResponseData<>(HttpStatus.OK,"Success");
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<String> deleteTag(@PathVariable int id){
        try {
            tagService.deleleTag(id);
            return new ResponseData<>(HttpStatus.OK,"Success");
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }

}
