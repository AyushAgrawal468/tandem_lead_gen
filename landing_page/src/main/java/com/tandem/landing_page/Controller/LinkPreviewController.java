package com.tandem.landing_page.Controller;

import com.tandem.landing_page.service.LinkPreviewService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Link previews (handoff 3.5). nginx sends only `location = /r`, `^~ /l/links` and `^~ /e/` here
 * (never a /r prefix, which would also catch /robots.txt). Returns the SPA shell with og: tags.
 */
@RestController
public class LinkPreviewController {

    private final LinkPreviewService previews;

    public LinkPreviewController(LinkPreviewService previews) {
        this.previews = previews;
    }

    @GetMapping(value = "/l/links", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> invite(@RequestParam(name = "event-id", required = false) String eventId,
                                         @RequestParam(name = "referral-code", required = false) String code) throws IOException {
        String mode = eventId == null ? "referral" : code == null ? "event" : "invite";
        return html(previews.page(mode, eventId, code));
    }

    @GetMapping(value = "/e/{eventId}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> event(@PathVariable String eventId) throws IOException {
        return html(previews.page("event", eventId, null));
    }

    @GetMapping(value = "/r", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> referral(@RequestParam(name = "ref", required = false) String code) throws IOException {
        return html(previews.page("referral", null, code));
    }

    // HTML is never cached by CloudFront or browsers (same as nginx's location /)
    private static ResponseEntity<String> html(String body) {
        return ResponseEntity.ok().cacheControl(CacheControl.noCache()).contentType(MediaType.TEXT_HTML).body(body);
    }
}
