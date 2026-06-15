package com.example.api_monitor.controller;

import com.example.api_monitor.dtos.DashboardResponseDto;
import com.example.api_monitor.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final MonitoringService service;

    @GetMapping
    public DashboardResponseDto getDashboard() {

        return service.getDashboard();
    }
}