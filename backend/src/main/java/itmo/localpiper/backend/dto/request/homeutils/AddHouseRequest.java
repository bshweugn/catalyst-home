package itmo.localpiper.backend.dto.request.homeutils;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddHouseRequest {
    
    @NotNull
    @NotBlank
    private String name;

    @NotNull
    private Double x;

    @NotNull
    private Double y;

    private Long locationId; // can be null
}
