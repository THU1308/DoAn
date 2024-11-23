package com.Website_Selling_Clother.service;

import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;

public interface IImageService {

    List<Image> getListImage();

    Image getImageById(int id) throws DataNotFoundException;

    Image insertImage(Image image);

    List<Image> getListByProductId(int userId);
}
