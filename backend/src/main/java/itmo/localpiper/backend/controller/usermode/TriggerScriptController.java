package itmo.localpiper.backend.controller.usermode;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.TriggerScriptRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.TriggerCondition;
import itmo.localpiper.backend.repository.TriggerConditionRepository;
import itmo.localpiper.backend.service.processing.scripts.AddTriggerScriptProcessorService;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.RequestTransformer;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;
import jakarta.servlet.http.HttpServletRequest;



@RestController
@RequestMapping("/api/scripts")
public class TriggerScriptController {
    
    @Autowired
    private RequestTransformer requestTransformer;

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private TriggerConditionRepository triggerConditionRepository;

    @Autowired
    private AddTriggerScriptProcessorService addTriggerScriptProcessorService;
    
    @PostMapping("/addTriggerScript")
    public ResponseEntity<OperationResultResponse> addTriggerScript(@RequestBody TriggerScriptRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(addTriggerScriptProcessorService.process(requestTransformer.transform(request, servletRequest)));
    }

    @GetMapping("/getTriggerScriptsByHouse")
    public ResponseEntity<List<TriggerCondition>> getTriggerScriptsByHouse(@RequestParam Long houseId, HttpServletRequest servletRequest) {
        RequestPair<Long> rp = requestTransformer.transform(houseId, servletRequest);
        accessValidationService.validateAccess(rp.getEmail(), houseId, AccessMode.LIGHT);
        return ResponseEntity.ok(triggerConditionRepository.findByHouseId(houseId));
    }

    @PostMapping("/deleteTriggerScript")
    public ResponseEntity<OperationResultResponse> deleteTriggerScript(@RequestBody Long triggerId, HttpServletRequest servletRequest) {
        TriggerCondition tc = triggerConditionRepository.findById(triggerId).get();
        RequestPair<Long> rp = requestTransformer.transform(triggerId, servletRequest);
        House house;
        if (tc.getCamera() == null) {
            house = tc.getDevice().getRoom().getFloor().getHouse();
        } else {
            house = tc.getCamera().getRoom().getFloor().getHouse();
        }
        accessValidationService.validateAccess(rp.getEmail(), house.getId(), AccessMode.STRICT);
        triggerConditionRepository.delete(tc);
        return ResponseEntity.ok(new OperationResultResponse(ProcessingStatus.SUCCESS, "Trigger deleted"));
    }
}
