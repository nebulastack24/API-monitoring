package com.example.api_monitor.dtos;
import lombok.*;
@Getter
@Setter
@Builder
public class DashboardResponseDto {

    private Long totalApis;

    private Long healthyApis;

    private Long failedApis;

    private Double averageResponseTime;

    private Double uptimePercentage;
}