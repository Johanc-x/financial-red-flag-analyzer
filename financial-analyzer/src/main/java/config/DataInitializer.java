package com.johan.financialanalyzer.config;

import com.johan.financialanalyzer.model.User;
import com.johan.financialanalyzer.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        return args -> {

            String username = System.getenv("APP_ADMIN_USER");
            String password = System.getenv("APP_ADMIN_PASSWORD");

            if (username == null || password == null) {
                System.out.println("Admin credentials not set in environment variables");
                return;
            }

            if (userRepository.findByUsername(username).isEmpty()) {

                User user = new User();
                user.setUsername(username);
                user.setPassword(encoder.encode(password));
                user.setRole("ADMIN");

                userRepository.save(user);

                System.out.println("Admin user created from env vars");
            }
        };
    }
}