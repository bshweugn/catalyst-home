package itmo.localpiper.backend.service.processing.invitations;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.request.user.KickRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.AbstractProcessor;

@Service
public class EvictionProcessor extends AbstractProcessor<Pair<String, KickRequest>, OperationResultResponse>{

    @Override
    protected Object send(Pair<String, KickRequest> request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'send'");
    }

    @Override
    protected OperationResultResponse pack(Object result) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'pack'");
    }
    
}
