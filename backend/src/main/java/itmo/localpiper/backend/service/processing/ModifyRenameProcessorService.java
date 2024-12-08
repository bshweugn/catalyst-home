package itmo.localpiper.backend.service.processing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.EntityRenameRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.entity.ActionService;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.service.entity.ScriptService;
import itmo.localpiper.backend.service.entity.TriggerConditionService;
import itmo.localpiper.backend.service.entity.UserService;
import itmo.localpiper.backend.util.ProcessingStatus;
import itmo.localpiper.backend.util.Renamable;

@Service
public class ModifyRenameProcessorService extends AbstractProcessor<EntityRenameRequest, OperationResultResponse>{

    @Autowired
    private UserService userService;
    
    @Autowired
    private LocationService locationService;

    @Autowired
    private HouseService houseService;

    @Autowired
    private FloorService floorService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private ActionService actionService;

    @Autowired
    private ScriptService scriptService;

    @Autowired
    private TriggerConditionService triggerConditionService;

    @Override
    protected Object send(EntityRenameRequest request) {
        Long id = request.getId();
        String newName = request.getNewName();
        Renamable entity = request.getEntity();

        if (entity != null) {
            switch (entity) {
                case USER -> userService.rename(id, newName);
                case LOCATION -> locationService.rename(id, newName);
                case HOUSE -> houseService.rename(id, newName);
                case FLOOR -> floorService.rename(id, newName);
                case ROOM -> roomService.rename(id, newName);
                case ACTION -> actionService.rename(id, newName);
                case SCRIPT -> scriptService.rename(id, newName);
                case TRIGGER -> triggerConditionService.rename(id, newName);
                default -> throw new IllegalArgumentException("Unsupported entity: " + entity);
            }
        }
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "idk what to write here");
    }
}