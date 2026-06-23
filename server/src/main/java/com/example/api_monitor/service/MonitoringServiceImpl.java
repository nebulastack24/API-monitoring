package com.example.api_monitor.service;
import com.example.api_monitor.dtos.*;
import com.example.api_monitor.entities.*;
import com.example.api_monitor.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.api_monitor.dtos.ApiResponseDto;
import org.springframework.data.domain.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class MonitoringServiceImpl
        implements MonitoringService {

    private final ApiCheckRepository apiCheckRepository;
    private final RestTemplate restTemplate;
    private final ExecutorService executorService =
            Executors.newFixedThreadPool(10);
    private final MonitoredApiRepository repository;

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
                .status("PENDING")
                .responseTime(0L)
                .uptimePercentage(100.0)
                .lastChecked(null)
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
                .map(api -> {
                    Optional<ApiCheck> lastCheckOpt = apiCheckRepository.findFirstByApiIdOrderByCheckedAtDesc(api.getId());
                    String status = lastCheckOpt.map(ApiCheck::getStatus).orElse("PENDING");
                    Long responseTime = lastCheckOpt.map(ApiCheck::getResponseTime).orElse(0L);
                    LocalDateTime lastChecked = lastCheckOpt.map(ApiCheck::getCheckedAt).orElse(null);

                    long totalChecks = apiCheckRepository.countByApiId(api.getId());
                    long healthyChecks = apiCheckRepository.countByApiIdAndStatus(api.getId(), "UP");
                    double uptimePct = totalChecks == 0 ? 100.0 : ((double) healthyChecks / totalChecks) * 100.0;

                    return ApiResponseDto.builder()
                            .id(api.getId())
                            .name(api.getName())
                            .url(api.getUrl())
                            .checkInterval(api.getCheckInterval())
                            .status(status)
                            .responseTime(responseTime)
                            .uptimePercentage(uptimePct)
                            .lastChecked(lastChecked)
                            .build();
                })
                .toList();
    }

    @Override
    public void deleteApi(Long id) {
        repository.deleteById(id);
    }
    @Override
    public void monitorApis() {

        List<MonitoredApi> apis = repository.findAll();

        for (MonitoredApi api : apis) {

            executorService.submit(() ->
                    checkApi(api)
            );
        }
    }

    private void checkApi(MonitoredApi api) {

        long startTime = System.currentTimeMillis();

        try {

            ResponseEntity<String> response =
                    restTemplate.getForEntity(
                            api.getUrl(),
                            String.class);

            long responseTime =
                    System.currentTimeMillis() - startTime;

            System.out.println(
                    api.getName()
                            + " -> UP -> "
                            + responseTime + " ms");

            ApiCheck apiCheck =
                    ApiCheck.builder()
                            .api(api)
                            .statusCode(response.getStatusCode().value())
                            .responseTime(responseTime)
                            .status("UP")
                            .checkedAt(LocalDateTime.now())
                            .build();

            apiCheckRepository.save(apiCheck);

        } catch (Exception ex) {

            long responseTime =
                    System.currentTimeMillis() - startTime;

            System.out.println(
                    api.getName()
                            + " -> DOWN");

            ApiCheck apiCheck =
                    ApiCheck.builder()
                            .api(api)
                            .statusCode(500)
                            .responseTime(responseTime)
                            .status("DOWN")
                            .checkedAt(LocalDateTime.now())
                            .build();

            apiCheckRepository.save(apiCheck);
        }
    }

    @Override
    public DashboardResponseDto getDashboard() {

        List<MonitoredApi> apis = repository.findAll();
        long totalApis = apis.size();

        long healthyApis = 0;
        long failedApis = 0;

        for (MonitoredApi api : apis) {
            Optional<ApiCheck> lastCheckOpt = apiCheckRepository.findFirstByApiIdOrderByCheckedAtDesc(api.getId());
            if (lastCheckOpt.isPresent()) {
                String status = lastCheckOpt.get().getStatus();
                if ("UP".equals(status)) {
                    healthyApis++;
                } else if ("DOWN".equals(status)) {
                    failedApis++;
                }
            }
        }

        Double averageResponseTime =
                apiCheckRepository.averageResponseTime();
        if (averageResponseTime == null) {
            averageResponseTime = 0.0;
        }

        long totalChecks =
                apiCheckRepository.count();

        long totalUpChecks =
                apiCheckRepository.countByStatus("UP");

        double uptimePercentage =
                totalChecks == 0
                        ? 100.0
                        : ((double) totalUpChecks / totalChecks) * 100;

        return DashboardResponseDto.builder()
                .totalApis(totalApis)
                .healthyApis(healthyApis)
                .failedApis(failedApis)
                .averageResponseTime(averageResponseTime)
                .uptimePercentage(uptimePercentage)
                .build();
    }
}