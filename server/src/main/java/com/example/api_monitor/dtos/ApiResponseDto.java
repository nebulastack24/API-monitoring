package com.example.api_monitor.dtos;

import lombok.*;

@Getter
@Setter
@Builder
public class ApiResponseDto {

    private Long id;

    private String name;

    private String url;

    private Integer checkInterval;
}