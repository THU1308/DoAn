package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.ImageRepository;
import com.Website_Selling_Clother.service.IImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService implements IImageService {

    @Autowired
    ImageRepository imageRepository;

    @Override
    public List<Image> getListImage() {
        return imageRepository.findAll();
    }

    @Override
    public Image getImageById(int id) throws DataNotFoundException {
        return imageRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Image không tồn tại id :" + id));
    }

    @Override
    public Image insertImage(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public List<Image> getListByProductId(int imageId) {
        List<Image> images = imageRepository.getListImage(imageId);
        return images;
    }
}
