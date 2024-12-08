package itmo.localpiper.backend.dto.response;

import com.fasterxml.jackson.databind.JsonNode;

import itmo.localpiper.backend.util.ProcessingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImportResultResponse {
    private ProcessingStatus status;
    private String message;
    private JsonNode json;
}
