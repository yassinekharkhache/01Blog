package talent._Blog.Service;

import java.security.Key;
import java.util.Map;
import java.util.Base64.Decoder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {
    public String extractUsername(String token) {
        return null;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToke(
        Map<String, Object> extraClaims,
        UserDetails userDetails
    ){
        return "TODO";
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode("SECRET_KEY_SECRET_KEY_SECRET_KEY_SECRET");
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
    