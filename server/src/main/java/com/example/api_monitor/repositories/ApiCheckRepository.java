package com.example.api_monitor.repositories;

import com.example.api_monitor.entities.ApiCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ApiCheckRepository
        extends JpaRepository<ApiCheck, Long> {

        Page<ApiCheck> findByApiId(
                Long apiId,
                Pageable pageable);
        long countByStatus(String status);
        java.util.Optional<ApiCheck> findFirstByApiIdOrderByCheckedAtDesc(Long apiId);
        long countByApiId(Long apiId);
        long countByApiIdAndStatus(Long apiId, String status);
        @Query("""
            SELECT AVG(a.responseTime)
FROM ApiCheck a
        """)
    Double averageResponseTime();
    }