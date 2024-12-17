package itmo.localpiper.backend.exceptions;

public class CommandNotAllowedException extends RuntimeException {
    
    public CommandNotAllowedException(String message) {
        super(message);
    }
}