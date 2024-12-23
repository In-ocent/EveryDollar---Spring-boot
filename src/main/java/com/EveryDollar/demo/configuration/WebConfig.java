// package com.EveryDollar.demo.configuration;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// // import io.micrometer.common.lang.NonNull;

// @Configuration
// public class WebConfig {

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
//                 registry.addMapping("/**") // Apply to all endpoints
//                         .allowedOrigins("http://127.0.0.1:5501", "http://localhost:5501") // Frontend origins
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed methods
//                         .allowedHeaders("*") // Allow all headers
//                         .allowCredentials(true) // Allow credentials (cookies)
//                         .maxAge(3600); // Cache preflight response for 1 hour
//             }
//         };
//     }
// }
