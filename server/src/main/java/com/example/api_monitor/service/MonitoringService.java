package com.example.api_monitor.service;

import com.example.api_monitor.dtos.ApiCheckResponseDto;
import com.example.api_monitor.dtos.ApiRequestDto;
import com.example.api_monitor.dtos.ApiResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MonitoringService {

    ApiResponseDto addApi(ApiRequestDto request);

    List<ApiResponseDto> getAllApis();

    void deleteApi(Long id);
    Page<ApiCheckResponseDto> getHistory(
            Long apiId,
            int page,
            int size);
}