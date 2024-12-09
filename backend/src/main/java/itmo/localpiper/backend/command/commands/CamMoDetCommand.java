package itmo.localpiper.backend.command.commands;


import org.springframework.beans.factory.annotation.Autowired;

import itmo.localpiper.backend.command.Command;
import itmo.localpiper.backend.service.entity.CameraService;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CamMoDetCommand implements Command{
    private Long camera_id;

    @Autowired
    private CameraService cameraService;

    @Override
    public void execute() {
        cameraService.changeStatus(camera_id, "MOTION_DETECTED");
    }
    
}
