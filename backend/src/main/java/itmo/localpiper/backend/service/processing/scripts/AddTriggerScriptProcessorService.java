package itmo.localpiper.backend.service.processing.scripts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.TriggerScriptRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.AbstractProcessor;
import itmo.localpiper.backend.service.transactional.TransactionalTriggerCreationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.TriggerScriptParser;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class AddTriggerScriptProcessorService extends AbstractProcessor<RequestPair<TriggerScriptRequest>, OperationResultResponse>{

    @Autowired
    private TriggerScriptParser triggerScriptParser;

    @Autowired
    private TransactionalTriggerCreationService ttcs;

    @Override
    protected Object send(RequestPair<TriggerScriptRequest> request) {
        String email = request.getEmail();
        String triggerString = request.getBody().getTriggerScriptString();

        TriggerScriptParser.ParsedTrigger parsedTrigger = triggerScriptParser.parseTriggerString(triggerString);
        ttcs.createTrigger(email, parsedTrigger);
        System.out.println(); // debug point
        return null;
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "Trigger added");
    }
    
}
