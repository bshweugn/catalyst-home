package itmo.localpiper.backend.command.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommandDTO {
    @NotBlank(message="Command cannot be blank")
    private String command;    
}
