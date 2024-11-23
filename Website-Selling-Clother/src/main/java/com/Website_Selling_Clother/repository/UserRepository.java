package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    @Query(value = "Select * from user where user_name = :userName",nativeQuery = true)
    User findByUserName(String userName);

    @Query(value = "Select * from user where email = :email",nativeQuery = true)
    User findByEmail(String email);
}
