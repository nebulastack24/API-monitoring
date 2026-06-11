package com.example.api_monitor.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ApiCheckResponseDto {

    private Integer statusCode;

    private Long responseTime;

    private String status;

    private LocalDateTime checkedAt;
}