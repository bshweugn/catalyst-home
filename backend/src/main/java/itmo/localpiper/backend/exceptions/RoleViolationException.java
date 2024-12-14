package itmo.localpiper.backend.exceptions;

public class RoleViolationException extends RuntimeException {
    public RoleViolationException(String message) {
        super(message);
    }
}
