package com.tandem.landing_page;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LandingPageApplication {

	public static void main(String[] args) {
		SpringApplication.run(LandingPageApplication.class, args);
	}

}
