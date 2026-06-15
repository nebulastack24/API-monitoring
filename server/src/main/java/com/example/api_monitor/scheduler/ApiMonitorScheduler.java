package com.example.api_monitor.scheduler;

import com.example.api_monitor.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApiMonitorScheduler {

    private final MonitoringService service;

    @Scheduled(fixedRate = 60000)
    public void monitorApis() {

        System.out.println(
                "Scheduler Running...");

        service.monitorApis();
    }
}