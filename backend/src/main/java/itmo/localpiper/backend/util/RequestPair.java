package itmo.localpiper.backend.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestPair<T> {
    private String email;
    private T body;
}
