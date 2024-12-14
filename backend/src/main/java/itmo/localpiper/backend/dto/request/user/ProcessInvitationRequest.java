package itmo.localpiper.backend.dto.request.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProcessInvitationRequest {
    @NotNull
    @Positive
    private Long inviteId;

    @NotNull
    private Boolean accept;
}
