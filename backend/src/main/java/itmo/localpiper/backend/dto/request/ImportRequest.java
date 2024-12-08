package itmo.localpiper.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImportRequest {
    @NotNull
    @NotBlank
    @Size(min=6,max=6)
    private String serialNumber;

}
