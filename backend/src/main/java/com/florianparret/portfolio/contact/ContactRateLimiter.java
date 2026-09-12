package com.florianparret.portfolio.contact;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import org.springframework.stereotype.Component;

// Limite en mémoire, par IP : suffisant pour un portfolio perso à faible trafic. L'état est
// perdu au redémarrage de l'instance (déploiement, réveil après mise en veille sur le tier
// gratuit Render), ce qui est un compromis acceptable ici plutôt que d'ajouter Redis.
@Component
class ContactRateLimiter {

    private static final int MAX_ATTEMPTS_PER_WINDOW = 5;
    private static final Duration WINDOW = Duration.ofHours(1);

    private final Clock clock;
    private final ConcurrentHashMap<String, Deque<Instant>> attemptsByIp = new ConcurrentHashMap<>();

    ContactRateLimiter() {
        this(Clock.systemUTC());
    }

    ContactRateLimiter(Clock clock) {
        this.clock = clock;
    }

    boolean allow(String ip) {
        Deque<Instant> attempts = attemptsByIp.computeIfAbsent(ip, key -> new ConcurrentLinkedDeque<>());
        Instant now = clock.instant();

        synchronized (attempts) {
            while (!attempts.isEmpty() && attempts.peekFirst().isBefore(now.minus(WINDOW))) {
                attempts.pollFirst();
            }
            if (attempts.size() >= MAX_ATTEMPTS_PER_WINDOW) {
                return false;
            }
            attempts.addLast(now);
            return true;
        }
    }
}
