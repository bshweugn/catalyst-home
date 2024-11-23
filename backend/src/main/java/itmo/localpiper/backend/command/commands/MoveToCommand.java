package itmo.localpiper.backend.command.commands;

import itmo.localpiper.backend.command.Command;
import lombok.Data;

@Data
public class MoveToCommand implements Command{
    private Long to;
    private Long from;
    public MoveToCommand(Long to, Long from) {
        if (from == null) {
            this.to = to;
            this.from = null;
        } else {
            this.to = to;
            this.from = from;
        }
    }
    
    @Override
    public void execute() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'execute'");
    }
    
}
