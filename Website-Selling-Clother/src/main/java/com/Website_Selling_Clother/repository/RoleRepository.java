package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.ERole;
import com.Website_Selling_Clother.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {
    Optional<Role> findByName(ERole name);
}
