package itmo.localpiper.backend.command.commands;

import itmo.localpiper.backend.command.Command;
import lombok.Data;

@Data
public class MoveToCommand implements Command{
    private String to;
    private String from;
    public MoveToCommand(String to, String from) {
        if (from == null || from.isEmpty()) {
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
