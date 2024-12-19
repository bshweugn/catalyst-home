package itmo.localpiper.backend.dto.request;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VideoStreamingRequest {
    @NotNull
    @Positive
    private Long cameraId;

    @NotNull
    private ZonedDateTime timestamp;
}
