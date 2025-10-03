package talent._Blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/images/");

        registry.addResourceHandler("/videos/**")
                .addResourceLocations("file:uploads/videos/");

        registry.addResourceHandler("/profiles/**")//src/main/resources/static/ /default.png
                .addResourceLocations("file:uploads/profiles/");

    }
}
