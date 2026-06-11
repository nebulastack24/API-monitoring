package com.example.api_monitor.dtos;

import lombok.*;

@Getter
@Setter
public class ApiRequestDto {

    private String name;

    private String url;

    private Integer checkInterval;
}