package itmo.localpiper.backend.dto.response;

import itmo.localpiper.backend.util.ProcessingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OperationResultResponse {

    private ProcessingStatus status;
    private String message;
}
