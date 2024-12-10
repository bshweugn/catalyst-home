package itmo.localpiper.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddRoomRequest {
    
    @NotNull
    @NotBlank
    private String name;

    @NotNull
    @Positive
    private Long floorId;
}
