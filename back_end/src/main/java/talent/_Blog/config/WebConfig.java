package talent._Blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/home/ykharkha/Desktop/01Blog/back_end/uploads/images/");

        registry.addResourceHandler("/videos/**")
                .addResourceLocations("file:/home/ykharkha/Desktop/01Blog/back_end/uploads/videos/");

        registry.addResourceHandler("/profiles/**")
                .addResourceLocations("file:/home/ykharkha/Desktop/01Blog/back_end/uploads/profiles/");
    }
}