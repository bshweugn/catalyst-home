package itmo.localpiper.backend.dto.request;

import itmo.localpiper.backend.util.enums.EntityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EntityInfoRequest {
    
    @NotNull
    private EntityType type;

    @NotNull
    @Positive
    private Long id;
}
