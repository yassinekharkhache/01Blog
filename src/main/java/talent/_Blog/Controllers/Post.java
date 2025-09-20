package talent._Blog.Controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import talent._Blog.dto.PostDto;


@Controller
@RequestMapping("/posts")
public class Post {
    @PostMapping("/add")
    public String requestMethodName(@Valid @RequestBody PostDto data,@AuthenticationPrincipal UserDetails userDetails) {
        userDetails.getUsername();
        return "";
    }
    
}
