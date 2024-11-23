package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image,Integer> {

    @Query(nativeQuery = true, value = "SELECT * FROM product_image WHERE product_id = ?")
    List<Image> getListImage(int imageId);
}
