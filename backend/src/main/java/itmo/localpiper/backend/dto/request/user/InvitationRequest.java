package itmo.localpiper.backend.dto.request.user;

import java.util.List;
import java.util.Map;

import org.springframework.data.util.Pair;

import itmo.localpiper.backend.util.enums.Movable;
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
    private Map<Pair<Long, Movable>, List<String>> actionList; // key is device id, list of strings is list of actions allowed for this device
}
