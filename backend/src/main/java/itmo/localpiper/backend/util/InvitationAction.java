package itmo.localpiper.backend.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvitationAction {
    
    private Long deviceId;

    private String deviceType;

    private String actionName;
}
