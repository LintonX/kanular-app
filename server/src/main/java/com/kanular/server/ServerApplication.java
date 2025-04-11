package com.kanular.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

//	@Bean
//	CommandLineRunner runner(UserRepository repository) {
//		return args -> {
//
//			UserAccount user = UserAccount.builder().email("test@example.com").password("test123").build();
//
//			UserAccount savedUser = repository.save(user);
////			User savedUser = repository.findById(Long.valueOf(user.getId())).orElseThrow(NoSuchElementException::new);
////
//			log.info(savedUser.toString());
//		};
//	}

}
