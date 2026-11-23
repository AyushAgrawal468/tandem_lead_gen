package com.tandem.landing_page.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;

/**
 * Link previews (handoff 3.5). WhatsApp and other crawlers don't run JS, so /l/links, /e/ and /r are
 * served here: the website's SPA shell (spa.html, never the prerendered index.html) with og: tags
 * filled from the event and the sender, plus robots noindex. People get the same shell and the React
 * link page loads as usual. Data comes from event-service's public link endpoint (no secret needed).
 */
@Service
public class LinkPreviewService {

    private static final Logger log = LoggerFactory.getLogger(LinkPreviewService.class);
    private static final Duration TTL = Duration.ofMinutes(5);
    private static final int MAX_CACHED = 2000;
    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("EEE d MMM", Locale.ENGLISH).withZone(ZoneId.of("Asia/Kolkata"));

    static final String DEFAULT_TITLE = "Tandem: swipe on plans, match with friends";
    static final String DEFAULT_DESCRIPTION = "Swipe on things to do in your city and see which friends want to do the same.";

    private final RestTemplate restTemplate;
    private final String apiBase;
    private final Path spaFile;
    // ponytail: in-memory per-instance cache with a size cap; one box today, so no shared cache needed
    private final Map<String, Cached> cache = new ConcurrentHashMap<>();

    private record Cached(Instant at, String html) {}
    record Tags(String title, String description, String image) {}

    public LinkPreviewService(RestTemplate restTemplate,
                              @Value("${preview.api-base:https://api.tandem.it.com}") String apiBase,
                              @Value("${preview.spa-file:/var/www/leadform/spa.html}") String spaFile) {
        this.restTemplate = restTemplate;
        this.apiBase = apiBase.replaceAll("/+$", "");
        this.spaFile = Path.of(spaFile);
    }

    /** mode: invite (/l/links with event + code), event (/e/ or /l/links without code), referral (/r). */
    public String page(String mode, String eventId, String code) throws IOException {
        String key = mode + "|" + eventId + "|" + code;
        Cached hit = cache.get(key);
        if (hit != null && hit.at().plus(TTL).isAfter(Instant.now())) return hit.html();

        // Read on every miss, so a deploy's new asset hashes are picked up within the cache TTL
        String html = fill(Files.readString(spaFile), tags(mode, fetch(eventId, code)));
        if (cache.size() >= MAX_CACHED) cache.clear();
        cache.put(key, new Cached(Instant.now(), html));
        return html;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetch(String eventId, String code) {
        try {
            UriComponentsBuilder url = UriComponentsBuilder.fromHttpUrl(apiBase + "/events/public/link");
            if (eventId != null) url.queryParam("eventId", eventId);
            if (code != null) url.queryParam("code", code);
            Map<String, Object> body = restTemplate.getForObject(url.encode().toUriString(), Map.class);
            return body == null ? Map.of() : body;
        } catch (Exception e) {
            log.warn("Link preview lookup failed eventId={} code={}: {}", eventId, code, e.getMessage());
            return Map.of(); // default tags
        }
    }

    /** Copy from the handoff's "Link previews" table. Missing or started events get the default tags. */
    @SuppressWarnings("unchecked")
    static Tags tags(String mode, Map<String, Object> link) {
        Map<String, Object> event = Boolean.TRUE.equals(link.get("eventOver")) ? null : (Map<String, Object>) link.get("event");
        Map<String, Object> sender = (Map<String, Object>) link.get("sender");
        String senderName = sender == null ? null : str(sender.get("firstName"));
        if (event != null) {
            String title = str(event.get("title"));
            String day = day(event);
            String area = area(str(event.get("location")), str(link.get("city")));
            String image = str(event.get("imageUrl"));
            if ("invite".equals(mode) && senderName != null) {
                return new Tags(senderName + " wants to go to " + title, join(", ", day, area) + ". Tap to say you're in.", image);
            }
            if (!"referral".equals(mode)) {
                return new Tags(join(" · ", title, day), (area == null ? "" : area + ". ") + "See which friends want to go, on Tandem.", image);
            }
        }
        if ("referral".equals(mode) && senderName != null) {
            return new Tags(senderName + " invited you to Tandem", "Swipe on things to do in your city. Match with friends who want the same.", null);
        }
        return new Tags(DEFAULT_TITLE, DEFAULT_DESCRIPTION, null);
    }

    /** The shell's own title and description/og/twitter tags are replaced, then ours go in before </head>. */
    static String fill(String spa, Tags t) {
        StringBuilder head = new StringBuilder()
                .append("<title>").append(esc(t.title())).append("</title>")
                .append(meta("name", "description", t.description()))
                .append(meta("name", "robots", "noindex"))
                .append(meta("property", "og:type", "website"))
                .append(meta("property", "og:site_name", "Tandem"))
                .append(meta("property", "og:title", t.title()))
                .append(meta("property", "og:description", t.description()))
                .append(meta("name", "twitter:card", t.image() == null ? "summary" : "summary_large_image"));
        if (t.image() != null) head.append(meta("property", "og:image", t.image()));
        String cleaned = spa
                .replaceFirst("(?is)<title>.*?</title>", "")
                .replaceAll("(?is)<meta\\s+(name=\"(description|robots)\"|property=\"og:[^\"]*\"|name=\"twitter:[^\"]*\")[^>]*>", "");
        return cleaned.replaceFirst("(?i)</head>", Matcher.quoteReplacement(head + "</head>"));
    }

    private static String meta(String attr, String name, String content) {
        return "<meta " + attr + "=\"" + name + "\" content=\"" + esc(content) + "\">";
    }

    static String esc(String s) {
        return s == null ? "" : s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    private static String day(Map<String, Object> event) {
        String display = str(event.get("displayDate"));
        if (display != null) return display;
        String starts = str(event.get("startsAt"));
        try { return starts == null ? null : DAY.format(Instant.parse(starts)); } catch (Exception e) { return null; }
    }

    // A location that is only the city name ("mumbai") isn't an area
    private static String area(String location, String city) {
        return location == null || location.equalsIgnoreCase(city) ? null : location;
    }

    private static String join(String sep, String... parts) {
        StringBuilder b = new StringBuilder();
        for (String p : parts) if (p != null) b.append(b.isEmpty() ? "" : sep).append(p);
        return b.toString();
    }

    private static String str(Object o) {
        return o == null || o.toString().isBlank() ? null : o.toString();
    }
}
