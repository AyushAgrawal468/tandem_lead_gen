package com.tandem.landing_page.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class CountdownTimerController {
    // Duration: 9 days (in seconds)
    private static final long COUNTDOWN_DURATION = 10L * 24 * 60 * 60; // 9 days

    // Fixed start time: September 1, 2025, 00:00:00 UTC
    private static final long FIXED_START_TIME = 1757448720000L; // Milliseconds since epoch (Sep 1, 2025)
    private static final long END_TIME = FIXED_START_TIME + (COUNTDOWN_DURATION * 1000);

    @GetMapping("/countdown")
    public CountdownResponse getRemainingTime() {
        long now = System.currentTimeMillis();
        long remainingSeconds = (END_TIME - now) / 1000;
        if (remainingSeconds < 0) remainingSeconds = 0;

        return new CountdownResponse(FIXED_START_TIME, remainingSeconds, END_TIME);
    }

    // DTO (Response class)
    public static class CountdownResponse {
        private final long startTime;
        private final long remainingSeconds;
        private final long endTime;

        public CountdownResponse(long startTime, long remainingSeconds, long endTime) {
            this.startTime = startTime;
            this.remainingSeconds = remainingSeconds;
            this.endTime = endTime;
        }

        public long getStartTime() {
            return startTime;
        }

        public long getRemainingSeconds() {
            return remainingSeconds;
        }

        public long getEndTime() {
            return endTime;
        }
    }

}
