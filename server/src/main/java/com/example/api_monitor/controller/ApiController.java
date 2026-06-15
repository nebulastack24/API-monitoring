package com.example.api_monitor.controller;

import com.example.api_monitor.dtos.ApiCheckResponseDto;
import com.example.api_monitor.dtos.ApiRequestDto;
import com.example.api_monitor.dtos.ApiResponseDto;
import com.example.api_monitor.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/apis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiController {

    private final MonitoringService service;

    @PostMapping
    public ApiResponseDto addApi(
            @RequestBody ApiRequestDto request) {

        return service.addApi(request);
    }

    @GetMapping
    public List<ApiResponseDto> getApis() {

        return service.getAllApis();
    }

    @GetMapping("/{id}/history")
    public Page<ApiCheckResponseDto> getHistory(
            @PathVariable Long id,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return service.getHistory(id, page, size);
    }

    @DeleteMapping("/{id}")
    public String deleteApi(
            @PathVariable Long id) {

        service.deleteApi(id);

        return "Deleted Successfully";
    }
}