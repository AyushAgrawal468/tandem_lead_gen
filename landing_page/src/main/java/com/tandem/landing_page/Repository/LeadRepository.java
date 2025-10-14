package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead,Long> {
    boolean existsByEmailAndMobile(String email,String mobile);

    // Use a native query to compare only the date portion of the created_at timestamp
    // Now using DD-MM-YYYY to match frontend input/normalization in the controller
    @Query(value = "SELECT * FROM lead WHERE to_char(created_at, 'DD-MM-YYYY') = :date", nativeQuery = true)
    List<Lead> findByCreatedAt(@Param("date") String date);
}
