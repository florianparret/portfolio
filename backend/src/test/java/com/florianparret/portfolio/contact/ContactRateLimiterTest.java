package com.florianparret.portfolio.contact;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import org.junit.jupiter.api.Test;

class ContactRateLimiterTest {

    private final MutableClock clock = new MutableClock(Instant.parse("2026-01-01T00:00:00Z"));
    private final ContactRateLimiter rateLimiter = new ContactRateLimiter(clock);

    @Test
    void allowsUpToFiveAttemptsPerIpWithinTheWindow() {
        for (int i = 0; i < 5; i++) {
            assertThat(rateLimiter.allow("1.2.3.4")).isTrue();
        }
    }

    @Test
    void rejectsTheSixthAttemptWithinTheWindow() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.allow("1.2.3.4");
        }

        assertThat(rateLimiter.allow("1.2.3.4")).isFalse();
    }

    @Test
    void tracksEachIpIndependently() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.allow("1.2.3.4");
        }

        assertThat(rateLimiter.allow("5.6.7.8")).isTrue();
    }

    @Test
    void allowsAgainAfterTheWindowElapses() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.allow("1.2.3.4");
        }
        clock.advance(Duration.ofHours(1).plusSeconds(1));

        assertThat(rateLimiter.allow("1.2.3.4")).isTrue();
    }

    private static final class MutableClock extends Clock {
        private Instant instant;

        private MutableClock(Instant instant) {
            this.instant = instant;
        }

        void advance(Duration duration) {
            instant = instant.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneId.of("UTC");
        }

        @Override
        public Clock withZone(ZoneId zone) {
            throw new UnsupportedOperationException();
        }

        @Override
        public Instant instant() {
            return instant;
        }
    }
}
