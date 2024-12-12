package itmo.localpiper.backend.dto.request.user;

import java.util.Map;

import itmo.localpiper.backend.model.Action;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvitationRequest {
    
    @NotNull
    @NotBlank
    private String email;

    @NotNull
    @Positive
    private Long houseId;

    @NotNull
    private Boolean isResident;

    @NotNull
    private Map<Long, Action> actionList;
}
