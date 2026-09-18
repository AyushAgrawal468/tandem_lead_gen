package com.tandem.landing_page.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Matches HealthCheckService's existing timeout convention for internal calls — an unbounded
    // RestTemplate risks thread-pool exhaustion if the called service hangs.
    private static final int INTERNAL_CALL_TIMEOUT_MS = 10_000;

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(INTERNAL_CALL_TIMEOUT_MS);
        factory.setReadTimeout(INTERNAL_CALL_TIMEOUT_MS);
        return new RestTemplate(factory);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("CORS config loaded");
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "https://tandem.it.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);

        // Public marketing redirect — open to all origins since it is a browser-navigation
        // endpoint shared in ads, QR codes, and email campaigns.
        registry.addMapping("/download")
                .allowedOrigins("*")
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }


}