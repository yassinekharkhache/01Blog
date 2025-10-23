package talent._Blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		var app = new SpringApplication(Application.class);
		app.setBanner((environment, sourceClass, out) -> {
			out.println("""
				
				░▒▓████████▓▒░   ░▒▓█▓▒░ ▒▓███████▓▒░░ ▒▓█▓▒░       ░▒▓██████▓▒░  ░▒▓██████▓▒░  
				░▒▓█▓▒░░▒▓█▓▒░ ▒▓████▓▒░ ▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░░▒▓█▓▒░ 
				░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░ ▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░        
				░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░ ▒▓███████▓▒░░ ▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒▒▓███▓▒░ 
				░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░ ▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░░▒▓█▓▒░ 
				░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░ ▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ▒▓█▓▒░░▒▓█▓▒░ 
				░▒▓████████▓▒░   ░▒▓█▓▒░ ▒▓███████▓▒░░ ▒▓████████▓▒ ░▒▓██████▓▒░  ░▒▓██████▓▒░  
				                                                                          
				                                                                          
				""");
		});
	    ConfigurableApplicationContext x = app.run(args);
	}
}
