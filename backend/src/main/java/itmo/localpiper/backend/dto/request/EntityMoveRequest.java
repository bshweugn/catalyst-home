package itmo.localpiper.backend.dto.request;

import itmo.localpiper.backend.util.enums.Movable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EntityMoveRequest {
    @NotNull
    @Positive
    private Long id;

    @NotNull
    @Positive
    private Long toId;

    @NotNull
    private Movable entity;
}
