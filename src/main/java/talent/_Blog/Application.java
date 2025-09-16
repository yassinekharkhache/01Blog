package talent._Blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		var app = new SpringApplication(Application.class);
		app.setBanner((environment, sourceClass, out) -> {
				out.println("\n\n  /$$$$$$    /$$   /$$       /$$                    \n" + //
							    " /$$$_  $$ /$$$$  | $$      | $$                    \n" + //
							    "| $$$$\\ $$|_  $$  | $$$$$$$ | $$  /$$$$$$   /$$$$$$ \n" + //
							    "| $$ $$ $$  | $$  | $$__  $$| $$ /$$__  $$ /$$__  $$\n" + //
							    "| $$\\ $$$$  | $$  | $$  \\ $$| $$| $$  \\ $$| $$  \\ $$\n" + //
							    "| $$ \\ $$$  | $$  | $$  | $$| $$| $$  | $$| $$  | $$\n" + //
							    "|  $$$$$$/ /$$$$$$| $$$$$$$/| $$|  $$$$$$/|  $$$$$$$\n" + //
							    " \\______/ |______/|_______/ |__/ \\______/  \\____  $$\n" + //
							    "                                           /$$  \\ $$\n" + //
							    "                                          |  $$$$$$/\n" + //
							    "                                           \\______/ \n\n");
			});
		app.run(args);
	}

}
