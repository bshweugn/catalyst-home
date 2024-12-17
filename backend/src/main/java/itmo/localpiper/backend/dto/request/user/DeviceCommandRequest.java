package itmo.localpiper.backend.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeviceCommandRequest {
    @NotNull
    @NotBlank
    private String command;

    private Object argument;

    @NotNull
    @Positive
    private Long deviceId;
}
