package com.tandem.landing_page.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/** Link previews (handoff 3.5): the handoff's og: copy, defaults for dead links, and safe HTML. */
class LinkPreviewServiceTest {

    private static final String SPA = "<!doctype html><html><head><meta charset=\"utf-8\">"
            + "<title>Tandem - Social Planning App</title><meta name=\"description\" content=\"old\">"
            + "<meta property=\"og:title\" content=\"old og\"></head><body><div id=\"root\"></div></body></html>";

    private static Map<String, Object> link(boolean over) {
        Map<String, Object> event = new HashMap<>();
        event.put("title", "Comedy Night");
        event.put("displayDate", "Sat 23 Nov");
        event.put("location", "Indiranagar");
        event.put("imageUrl", "https://img/comedy.jpg");
        Map<String, Object> link = new HashMap<>();
        link.put("event", event);
        link.put("city", "bengaluru");
        link.put("eventOver", over);
        link.put("sender", Map.of("firstName", "Riya", "photo", ""));
        return link;
    }

    @Test
    void invite_usesHandoffCopy() {
        LinkPreviewService.Tags t = LinkPreviewService.tags("invite", link(false));
        assertEquals("Riya wants to go to Comedy Night", t.title());
        assertEquals("Sat 23 Nov, Indiranagar. Tap to say you're in.", t.description());
        assertEquals("https://img/comedy.jpg", t.image());
    }

    @Test
    void eventOnly_andReferral() {
        assertEquals("Comedy Night · Sat 23 Nov", LinkPreviewService.tags("event", link(false)).title());
        assertEquals("Indiranagar. See which friends want to go, on Tandem.", LinkPreviewService.tags("event", link(false)).description());
        assertEquals("Riya invited you to Tandem", LinkPreviewService.tags("referral", link(false)).title());
    }

    @Test
    void startedOrMissingEvent_getsDefaults() {
        assertEquals(LinkPreviewService.DEFAULT_TITLE, LinkPreviewService.tags("event", link(true)).title());
        assertEquals(LinkPreviewService.DEFAULT_TITLE, LinkPreviewService.tags("invite", Map.of()).title());
    }

    @Test
    void fill_replacesShellTags_andEscapes() {
        String html = LinkPreviewService.fill(SPA, new LinkPreviewService.Tags("Riya <3 \"gigs\"", "d & e", null));
        assertFalse(html.contains("Social Planning App"));
        assertFalse(html.contains("old og"));
        assertFalse(html.contains("content=\"old\""));
        assertTrue(html.contains("<title>Riya &lt;3 &quot;gigs&quot;</title>"));
        assertTrue(html.contains("<meta name=\"robots\" content=\"noindex\">"));
        assertTrue(html.contains("<meta property=\"og:description\" content=\"d &amp; e\">"));
        assertTrue(html.contains("<div id=\"root\"></div>"), "the React shell stays intact");
    }

    @Test
    @SuppressWarnings("unchecked")
    void page_readsShell_callsApiOnce_thenCaches(@TempDir Path dir) throws Exception {
        Path spa = dir.resolve("spa.html");
        Files.writeString(spa, SPA);
        RestTemplate rest = mock(RestTemplate.class);
        when(rest.getForObject(anyString(), eq(Map.class))).thenReturn(link(false));
        LinkPreviewService service = new LinkPreviewService(rest, "https://demo-api.example/", spa.toString());

        String first = service.page("invite", "E1", "RIYA1234");
        String second = service.page("invite", "E1", "RIYA1234");

        assertTrue(first.contains("Riya wants to go to Comedy Night"));
        assertSame(first, second);
        verify(rest, times(1)).getForObject(eq("https://demo-api.example/events/public/link?eventId=E1&code=RIYA1234"), eq(Map.class));
    }

    @Test
    @SuppressWarnings("unchecked")
    void apiDown_stillServesTheShellWithDefaults(@TempDir Path dir) throws Exception {
        Path spa = dir.resolve("spa.html");
        Files.writeString(spa, SPA);
        RestTemplate rest = mock(RestTemplate.class);
        when(rest.getForObject(anyString(), eq(Map.class))).thenThrow(new RuntimeException("down"));
        String html = new LinkPreviewService(rest, "https://api", spa.toString()).page("event", "E1", null);
        assertTrue(html.contains(LinkPreviewService.DEFAULT_TITLE));
        assertTrue(html.contains("<div id=\"root\"></div>"));
    }
}
