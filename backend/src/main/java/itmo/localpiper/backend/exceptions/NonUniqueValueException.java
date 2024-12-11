package itmo.localpiper.backend.exceptions;



public class NonUniqueValueException extends RuntimeException {
    
    public NonUniqueValueException(String message) {
        super(message);
    }
}
