package itmo.localpiper.backend.service.processing;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import itmo.localpiper.backend.dto.request.ImportRequest;
import itmo.localpiper.backend.dto.response.ImportResultResponse;
import itmo.localpiper.backend.util.ProcessingStatus;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ImportProcessorService extends AbstractProcessor<ImportRequest, ImportResultResponse>{

    private final Map<String, JsonNode> deviceRegistry;

    @Override
    protected Object send(ImportRequest request) {
        String serialNumber = request.getSerialNumber();
        JsonNode device = deviceRegistry.get(serialNumber);
        return device;
    }

    @Override
    protected ImportResultResponse pack(Object result) {
        if (result == null) {
            return new ImportResultResponse(ProcessingStatus.ERROR, "Device with given serial number does not exist", null);
        }
        return new ImportResultResponse(ProcessingStatus.SUCCESS, "Found device", (JsonNode)result);
    }

}
