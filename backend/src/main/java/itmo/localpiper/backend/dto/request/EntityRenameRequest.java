package itmo.localpiper.backend.dto.request;

import itmo.localpiper.backend.util.Renamable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EntityRenameRequest {
    
    @NotNull
    @Positive
    private Long id;

    @NotNull
    @NotBlank
    private String newName;

    @NotNull
    @NotBlank
    private Renamable entity;

}
