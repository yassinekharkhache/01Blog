package talent._Blog.Exception;

public class MediaLimitExceededException extends RuntimeException {
    public MediaLimitExceededException(String message) {
        super(message);
    }
}
