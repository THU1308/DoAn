package com.Website_Selling_Clother.service;


import com.Website_Selling_Clother.dto.SizeDTO;
import com.Website_Selling_Clother.entity.Size;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;

public interface ISizeService {

    List<Size> findAll();
    Size createSize(SizeDTO sizeDTO);
    void deleteSize(int id) throws DataNotFoundException;
    boolean updateSize(int id, SizeDTO sizeDTO);
    List<Size> getStSizeOfProduct(int id);
    Integer findIdBySizeName(String sizeName);
}
