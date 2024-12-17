package itmo.localpiper.backend.dto.request.device;

import itmo.localpiper.backend.util.enums.Movable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeviceDeleteRequest {
    @NotNull
    @Positive
    private Long deviceId;

    @NotNull
    @Positive
    private Long houseId;

    @NotNull
    private Movable type;
}
