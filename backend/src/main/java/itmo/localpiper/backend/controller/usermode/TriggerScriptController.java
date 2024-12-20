package itmo.localpiper.backend.controller.usermode;

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
import itmo.localpiper.backend.service.processing.scripts.AddTriggerScriptProcessorService;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;



@RestController
@RequestMapping("/api/scripts")
public class TriggerScriptController {
    
    @Autowired
    private RequestTransformer requestTransformer;

    @Autowired
    private AddTriggerScriptProcessorService addTriggerScriptProcessorService;
    
    @PostMapping("/addTriggerScript")
    public ResponseEntity<OperationResultResponse> addTriggerScript(@RequestBody TriggerScriptRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(addTriggerScriptProcessorService.process(requestTransformer.transform(request, servletRequest)));
    }

    @GetMapping("/getTriggerScriptsByHouse")
    public String getTriggerScriptsByHouse(@RequestParam Long houseId, HttpServletRequest servletRequest) {
        throw new UnsupportedOperationException();
    }

    @PostMapping("/deleteTriggerScript")
    public ResponseEntity<OperationResultResponse> deleteTriggerScript(@RequestBody Long triggerId, HttpServletRequest servletRequest) {
        throw new UnsupportedOperationException();
    }
}
