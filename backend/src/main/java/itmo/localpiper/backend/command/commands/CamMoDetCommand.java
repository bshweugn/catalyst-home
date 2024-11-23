package itmo.localpiper.backend.command.commands;

import itmo.localpiper.backend.command.Command;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CamMoDetCommand implements Command{
    private Long camera_id;

    @Override
    public void execute() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'execute'");
    }
    
}
