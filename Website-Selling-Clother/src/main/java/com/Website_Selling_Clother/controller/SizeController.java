package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.CategoryDTO;
import com.Website_Selling_Clother.dto.SizeDTO;
import com.Website_Selling_Clother.entity.Size;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.service.Imp.SizeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/size")
public class SizeController {

    @Autowired
    SizeService sizeService;

    @GetMapping("")
    public ResponseData<List<Size>> getListSize(){
        return new ResponseData<>(HttpStatus.OK,"Success",sizeService.findAll());
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<Size> createSize(@RequestBody SizeDTO sizeDTO){
        Size size = sizeService.createSize(sizeDTO);
        return new ResponseData<>(HttpStatus.OK,"Success",size);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<String> deleteSize(@PathVariable int id){
        try {
            sizeService.deleteSize(id);
            return new ResponseData<>(HttpStatus.OK,("Xóa thành công size id: " + id));
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.OK,e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<Boolean> updateSizeById(@PathVariable int id, @RequestBody SizeDTO sizeDTO){
        boolean isSuccess = sizeService.updateSize(id,sizeDTO);
        return new ResponseData<>(HttpStatus.OK,"Success",isSuccess);
    }

    @GetMapping("/productSizes/{id}")
    public ResponseData<List<Size>> getSizeOfProDuct(@PathVariable int id){
        return  new ResponseData<>(HttpStatus.OK,"Success",sizeService.getStSizeOfProduct(id));
    }

    @GetMapping("/findIdByName")
    public  ResponseData<Integer> getSizeIdByName(@RequestParam String sizeName){
        return new ResponseData<>(HttpStatus.OK,"Success",sizeService.findIdBySizeName(sizeName));
    }
}
