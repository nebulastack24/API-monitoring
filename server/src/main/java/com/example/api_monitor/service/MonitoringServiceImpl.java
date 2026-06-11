package com.example.api_monitor.service;
import com.example.api_monitor.dtos.ApiCheckResponseDto;
import com.example.api_monitor.dtos.ApiRequestDto;
import com.example.api_monitor.entities.MonitoredApi;
import com.example.api_monitor.repositories.ApiCheckRepository;
import com.example.api_monitor.repositories.MonitoredApiRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.api_monitor.dtos.ApiResponseDto;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitoringServiceImpl
        implements MonitoringService {

    private final MonitoredApiRepository repository;
    private final ApiCheckRepository apiCheckRepository;

    @Override
    public ApiResponseDto addApi(ApiRequestDto request) {

        MonitoredApi api = MonitoredApi.builder()
                .name(request.getName())
                .url(request.getUrl())
                .checkInterval(request.getCheckInterval())
                .build();

        api = repository.save(api);

        return ApiResponseDto.builder()
                .id(api.getId())
                .name(api.getName())
                .url(api.getUrl())
                .checkInterval(api.getCheckInterval())
                .build();
    }

    @Override
    public Page<ApiCheckResponseDto> getHistory(
            Long apiId,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return apiCheckRepository
                .findByApiId(apiId, pageable)
                .map(check -> ApiCheckResponseDto.builder()
                        .statusCode(check.getStatusCode())
                        .responseTime(check.getResponseTime())
                        .status(check.getStatus())
                        .checkedAt(check.getCheckedAt())
                        .build());
    }

    @Override
    public List<ApiResponseDto> getAllApis() {

        return repository.findAll()
                .stream()
                .map(api -> ApiResponseDto.builder()
                        .id(api.getId())
                        .name(api.getName())
                        .url(api.getUrl())
                        .checkInterval(api.getCheckInterval())
                        .build())
                .toList();
    }

    @Override
    public void deleteApi(Long id) {
        repository.deleteById(id);
    }
}