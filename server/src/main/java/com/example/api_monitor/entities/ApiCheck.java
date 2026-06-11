package com.example.api_monitor.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_checks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer statusCode;

    private Long responseTime;

    private String status;

    private LocalDateTime checkedAt;

    @ManyToOne
    @JoinColumn(name = "api_id")
    private MonitoredApi api;
}