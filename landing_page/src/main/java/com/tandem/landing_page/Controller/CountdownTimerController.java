package com.tandem.landing_page.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class CountdownTimerController {
    // Duration: 9 days (in seconds)
    private static final long COUNTDOWN_DURATION = 9L * 24 * 60 * 60; // 9 days

    // Start and End times in millis
    private static final long startTime = System.currentTimeMillis();
    private static final long endTime = startTime + (COUNTDOWN_DURATION * 1000);

    @GetMapping("/countdown")
    public CountdownResponse getRemainingTime() {
        long now = System.currentTimeMillis();
        long remainingSeconds = (endTime - now) / 1000;
        if (remainingSeconds < 0) remainingSeconds = 0;

        return new CountdownResponse(remainingSeconds, endTime);
    }

    // DTO (Response class)
    public static class CountdownResponse {
        private long remainingSeconds;
        private long endTime;

        public CountdownResponse(long remainingSeconds, long endTime) {
            this.remainingSeconds = remainingSeconds;
            this.endTime = endTime;
        }

        public long getRemainingSeconds() {
            return remainingSeconds;
        }

        public long getEndTime() {
            return endTime;
        }
    }

}
