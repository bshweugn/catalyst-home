package itmo.localpiper.backend.service.transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Script;
import itmo.localpiper.backend.model.TriggerCondition;
import itmo.localpiper.backend.model.UserHouseRel;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.ScriptRepository;
import itmo.localpiper.backend.repository.TriggerConditionRepository;
import itmo.localpiper.backend.service.entity.TriggerConditionService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.TriggerScriptParser;
import itmo.localpiper.backend.util.enums.AccessMode;

@Service
public class TransactionalTriggerCreationService {

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private TriggerConditionService triggerConditionService;

    @Autowired
    private TriggerConditionRepository triggerConditionRepository;

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private AccessValidationService accessValidationService;
    
    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void createTrigger(String email, TriggerScriptParser.ParsedTrigger parsedTrigger) {
        TriggerScriptParser.RawTrigger rawTrigger = parsedTrigger.getTrigger();
        // check raw trigger
        String predicate = rawTrigger.getPredicate();
        TriggerCondition triggerCondition;
        if ("MOTION_DETECTED".equals(predicate)) {
            Camera camera = cameraRepository.findById(Long.valueOf(rawTrigger.getId())).get();
            accessValidationService.validateAccess(email, camera.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
            triggerCondition = triggerConditionService.create("trigger", rawTrigger.getRaw());
            triggerCondition.setCamera(camera);
            triggerConditionRepository.save(triggerCondition);
        } else {
            Device device = deviceRepository.findById(Long.valueOf(rawTrigger.getId())).get();
            accessValidationService.validateAccess(email, device.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
            triggerCondition = triggerConditionService.create("trigger", rawTrigger.getRaw());
            triggerCondition.setDevice(device);
            triggerConditionRepository.save(triggerCondition);
        }
        List<TriggerScriptParser.RawScript> rawScripts = parsedTrigger.getScripts();
        // check scripts
        for (TriggerScriptParser.RawScript rawScript : rawScripts) {
            Device device = deviceRepository.findById(Long.valueOf(rawScript.getId())).get();
            UserHouseRel uhr = accessValidationService.validateAccess(email, device.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
            Script script = new Script();
            script.setAction(rawScript.toString());
            script.setName("script");
            script.setTriggerCondition(triggerCondition);
            script.setUser(uhr.getUser());
            scriptRepository.save(script);
        }
        // toggle active
        triggerCondition.setIsActive(true);
        triggerConditionRepository.save(triggerCondition);
    }
}
