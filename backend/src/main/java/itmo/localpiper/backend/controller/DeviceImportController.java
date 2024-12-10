package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.ImportCreateRequest;
import itmo.localpiper.backend.dto.request.ImportRequest;
import itmo.localpiper.backend.dto.response.ImportResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.ImportCreateProcessorService;
import itmo.localpiper.backend.service.processing.ImportProcessorService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/create")
public class DeviceImportController {
    
    @Autowired
    private ImportProcessorService importProcessorService;

    @Autowired
    private ImportCreateProcessorService importCreateProcessorService;

    @PostMapping("/checkDevice")
    public ResponseEntity<ImportResultResponse> checkDeviceNumber(@Valid @RequestBody ImportRequest request) {
        return ResponseEntity.ok(importProcessorService.process(request));
    }

    @PostMapping("/importDevice")
    public ResponseEntity<OperationResultResponse> importAndCreateDevice(@Valid @RequestBody ImportCreateRequest request) {
        return ResponseEntity.ok(importCreateProcessorService.process(request));
    }
    
    
}
