package com.example.api_monitor.repositories;

import com.example.api_monitor.entities.MonitoredApi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonitoredApiRepository
        extends JpaRepository<MonitoredApi, Long> {
}
