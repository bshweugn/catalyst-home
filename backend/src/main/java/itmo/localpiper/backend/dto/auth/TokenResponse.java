package itmo.localpiper.backend.dto.auth;

import itmo.localpiper.backend.dto.response.OperationResultResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponse {

    @NotNull
    @NotBlank
    private String token;

    @NotNull
    private OperationResultResponse response;

}
