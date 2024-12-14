package itmo.localpiper.backend.dto.request.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaveRequest {
    @NotNull
    @Positive
    private Long houseId;

    @Positive
    private Long newOwnerId; // only used when the one leaving is the owner of the house
}
