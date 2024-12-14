package itmo.localpiper.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HoldableResultResponse<T> {
    T data;
    OperationResultResponse status;
}
