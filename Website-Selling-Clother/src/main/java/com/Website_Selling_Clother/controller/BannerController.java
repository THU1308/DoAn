package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.entity.Banner;
import com.Website_Selling_Clother.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("${api.prefix}/banner")
public class BannerController {

    @Autowired
    BannerRepository bannerRepository;

    @GetMapping("")
    public ResponseData<List<Banner>> getList() {
        return new ResponseData<>(HttpStatus.OK, "Success", bannerRepository.findAll());
    }

    @GetMapping(value = "/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> getImageByID(@PathVariable int id) {
        Banner banner = null;
        try {
            banner = bannerRepository.findById(id).orElseThrow();
            byte[] imageData = banner.getImageData();
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<?> createBanner(@RequestParam("file") MultipartFile file) {
        try {
            Banner banner = new Banner();
            banner.setImageData(file.getBytes());
            bannerRepository.save(banner);
            return new ResponseData<>(HttpStatus.OK, "Success", banner);
        } catch (IOException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST, "Fail", e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseData<?> updateBanner(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        try {
            Banner banner = bannerRepository.findById(id).orElseThrow();
            banner.setImageData(file.getBytes());
            Banner updatedBanner = bannerRepository.save(banner);
            return new ResponseData<>(HttpStatus.OK, "Success", updatedBanner);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseData<>(HttpStatus.BAD_REQUEST, "Fail", e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseData<?> deleteBanner(@PathVariable int id) {
        try {
            bannerRepository.deleteById(id);
            return new ResponseData<>(HttpStatus.OK, "Xóa thành công");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseData<>(HttpStatus.BAD_REQUEST, "Fail", e.getMessage());
        }
    }
}
