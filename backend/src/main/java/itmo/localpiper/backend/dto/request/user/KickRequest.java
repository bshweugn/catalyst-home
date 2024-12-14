package itmo.localpiper.backend.dto.request.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KickRequest {
    
    @NotNull
    @Positive
    private Long userId;

    @NotNull
    @Positive
    private Long houseId;
}
