package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    @Query("SELECT s FROM ProductSize ps " +
            "JOIN ps.size s " +
            "JOIN ps.product p " +
            "WHERE p.id = :productId")
    List<Size> getSizeOfProduct(@Param("productId") int productId);

    @Query("SELECT s.id FROM Size s WHERE s.name = :name")
    Integer findIdByName(String name);

}
