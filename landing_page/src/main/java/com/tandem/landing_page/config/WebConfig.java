package com.tandem.landing_page.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("CORS config loaded");
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "https://tandem.it.com") // allow both dev & prod
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // include OPTIONS
                .allowedHeaders("*")  // allow all headers
                .allowCredentials(false); // set true if you’re using cookies/auth headers
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Any route that isn't /api/** should forward to index.html
        registry.addViewController("/{spring:(?!api).*}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:(?!api).*}")
                .setViewName("forward:/index.html");
    }
}