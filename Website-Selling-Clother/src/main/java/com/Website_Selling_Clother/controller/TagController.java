package com.example.shopclothes.controller;

import com.example.shopclothes.dto.TagDTO;
import com.example.shopclothes.entity.Tag;
import com.example.shopclothes.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/tag")
public class TagController {

    @Autowired
    TagService tagService;

    @GetMapping("")
    public ResponseEntity<?> getListTag(){
        return ResponseEntity.ok(tagService.getListTag());
    }

    @PostMapping("/create")
    public ResponseEntity<Tag> createTag(@RequestBody TagDTO tagDTO){
        Tag tag = tagService.createTag(tagDTO);
        tag.setEnable(true);
        return ResponseEntity.ok(tag);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateTag(@PathVariable int id,@RequestBody TagDTO tagDTO){
        try {
            Tag tag = tagService.updateTag(id, tagDTO);
            return ResponseEntity.ok(tag);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/enable/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> enabled(@PathVariable int id){
        try {
            tagService.enableTag(id);
            return ResponseEntity.ok("Enable tag thành công");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteTag(@PathVariable int id){
        try {
            tagService.deleleTag(id);
            return ResponseEntity.ok("Xóa tag thành công");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

}
