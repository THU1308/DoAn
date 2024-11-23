package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.SizeDTO;
import com.Website_Selling_Clother.entity.Category;
import com.Website_Selling_Clother.entity.Size;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.SizeRepository;
import com.Website_Selling_Clother.service.ISizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeService implements ISizeService {

    @Autowired
    SizeRepository sizeRepository;

    @Override
    public List<Size> findAll() {
       return sizeRepository.findAll();
    }

    @Override
    public Size createSize(SizeDTO sizeDTO) {
        Size size = new Size();
        size.setName(sizeDTO.getName());
        sizeRepository.save(size);
        return size;
    }

    @Override
    public void deleteSize(int id) throws DataNotFoundException {
        Size size = sizeRepository.findById(id).orElseThrow(()->new DataNotFoundException("Không tìm thấy id size"));
        sizeRepository.delete(size);
    }

    @Override
    public boolean updateSize(int id, SizeDTO sizeDTO) {
        boolean isUpdate = false;
        Size size = null;
        try {
            size = sizeRepository.findById(id).orElseThrow();
            size.setName(sizeDTO.getName());
            sizeRepository.save(size);
            isUpdate = true;
        } catch (Exception e) {
            System.out.println("Error update size: " + e.getMessage());
        }
        return isUpdate;
    }

    @Override
    public List<Size> getStSizeOfProduct(int id){
        return sizeRepository.getSizeOfProduct(id);
    }

    @Override
    public Integer findIdBySizeName(String sizeName) {
        return sizeRepository.findIdByName(sizeName);
    }
}
