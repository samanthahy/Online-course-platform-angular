package com.mercury.OnlineCoursePlatformBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableCaching
@SpringBootApplication

public class OnlineCoursePlatformBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineCoursePlatformBackendApplication.class, args);
	}

}
