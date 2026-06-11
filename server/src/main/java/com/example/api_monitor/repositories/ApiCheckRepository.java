package com.example.api_monitor.repositories;

import com.example.api_monitor.entities.ApiCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiCheckRepository
        extends JpaRepository<ApiCheck, Long> {

        Page<ApiCheck> findByApiId(
                Long apiId,
                Pageable pageable);
    }
