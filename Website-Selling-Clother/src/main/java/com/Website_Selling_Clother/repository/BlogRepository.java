package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog,Integer> {

    @Query(value = "Select * from Blog order by id desc limit :limit",nativeQuery = true)
    List<Blog> getListBlogNewe(int limit);
}
