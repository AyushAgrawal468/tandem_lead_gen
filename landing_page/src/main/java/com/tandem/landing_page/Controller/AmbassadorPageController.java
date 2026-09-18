package com.tandem.landing_page.Controller;

import com.tandem.landing_page.service.AmbassadorPageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ambassador")
@CrossOrigin(origins = "*")
public class AmbassadorPageController {

    private final AmbassadorPageService pageService;

    public AmbassadorPageController(AmbassadorPageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/page")
    public ResponseEntity<?> getPage(@RequestParam String token) {
        Map<String, Object> data = pageService.fetchPageData(token);
        if (data == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Not found");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "ok",
                "data", data
        ));
    }
}
