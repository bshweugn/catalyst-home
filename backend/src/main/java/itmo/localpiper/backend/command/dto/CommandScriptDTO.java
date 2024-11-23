package itmo.localpiper.backend.command.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CommandScriptDTO {
    @NotEmpty(message = "Command list cannot be empty")
    private List<String> commands;
}
