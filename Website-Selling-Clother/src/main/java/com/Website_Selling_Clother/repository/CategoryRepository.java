package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CategoryRepository extends JpaRepository<Category,Integer> {
    @Query(value ="Select * from Category where enable = :enable",nativeQuery = true)
    List<Category> findAllByEnable(boolean enable);
}
