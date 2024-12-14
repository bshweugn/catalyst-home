package itmo.localpiper.backend.dto.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PfpRequest {
    
    @NotNull
    private byte[] newPfp;
}
