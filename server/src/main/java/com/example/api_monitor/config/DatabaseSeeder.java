package com.example.api_monitor.config;

import com.example.api_monitor.entities.ApiCheck;
import com.example.api_monitor.entities.MonitoredApi;
import com.example.api_monitor.repositories.ApiCheckRepository;
import com.example.api_monitor.repositories.MonitoredApiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final MonitoredApiRepository apiRepository;
    private final ApiCheckRepository checkRepository;
    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (apiRepository.count() == 0) {
            System.out.println("Seeding database with mock API monitoring data...");

            // Create some mock APIs
            MonitoredApi github = createApi("GitHub API", "https://api.github.com", 60);
            MonitoredApi stripe = createApi("Stripe API", "https://api.stripe.com", 60);
            MonitoredApi slack = createApi("Slack API", "https://api.slack.com", 60);
            MonitoredApi twilio = createApi("Twilio API", "https://api.twilio.com", 60);
            MonitoredApi aws = createApi("AWS S3 Service", "https://s3.amazonaws.com", 60);
            MonitoredApi vercel = createApi("Vercel Edge API", "https://vercel.com", 60);
            MonitoredApi supabase = createApi("Supabase API", "https://api.supabase.com", 60);
            MonitoredApi auth0 = createApi("Auth0 Service", "https://auth0.com", 60);

            // Seed checks for each API (to have history)
            seedChecks(github, 99, 120, 20); // 99% uptime, 120ms average
            seedChecks(stripe, 97, 85, 15);  // 97% uptime, 85ms average
            seedChecks(slack, 100, 150, 30); // 100% uptime, 150ms average
            seedChecks(twilio, 98, 110, 25); // 98% uptime, 110ms average
            seedChecks(aws, 99, 60, 10);     // 99% uptime, 60ms average
            seedChecks(vercel, 100, 75, 12);  // 100% uptime, 75ms average
            seedChecks(supabase, 96, 210, 45); // 96% uptime, 210ms average
            seedChecks(auth0, 95, 130, 25);  // 95% uptime, 130ms average

            System.out.println("Database seeding completed.");
        }
    }

    private MonitoredApi createApi(String name, String url, int checkInterval) {
        MonitoredApi api = MonitoredApi.builder()
                .name(name)
                .url(url)
                .checkInterval(checkInterval)
                .createdAt(LocalDateTime.now().minusDays(7))
                .build();
        return apiRepository.save(api);
    }

    private void seedChecks(MonitoredApi api, int uptimePct, int avgResponseTime, int variance) {
        LocalDateTime now = LocalDateTime.now();
        // Seed 10 check history entries going back in time
        for (int i = 9; i >= 0; i--) {
            boolean isUp = random.nextInt(100) < uptimePct;
            long responseTime = isUp ? (avgResponseTime + random.nextInt(variance * 2) - variance) : 0;
            int statusCode = isUp ? 200 : 503;
            String status = isUp ? "UP" : "DOWN";

            ApiCheck check = ApiCheck.builder()
                    .api(api)
                    .statusCode(statusCode)
                    .responseTime(responseTime)
                    .status(status)
                    .checkedAt(now.minusHours(i * 2L))
                    .build();
            checkRepository.save(check);
        }
    }
}
