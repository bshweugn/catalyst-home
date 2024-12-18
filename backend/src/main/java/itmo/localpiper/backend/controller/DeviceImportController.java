package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.device.DeviceDeleteRequest;
import itmo.localpiper.backend.dto.request.device.ImportCreateRequest;
import itmo.localpiper.backend.dto.request.device.ImportRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.ImportResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.device.DeleteDeviceProcessorService;
import itmo.localpiper.backend.service.processing.device.ImportCreateProcessorService;
import itmo.localpiper.backend.service.processing.device.ImportProcessorService;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/device")
public class DeviceImportController {
    
    @Autowired
    private ImportProcessorService importProcessorService;

    @Autowired
    private ImportCreateProcessorService importCreateProcessorService;

    @Autowired
    private DeleteDeviceProcessorService deleteDeviceProcessorService;

    @Autowired
    private RequestTransformer requestTransformer;

    @PostMapping("/checkDevice")
    public ResponseEntity<ImportResultResponse> checkDeviceNumber(
        @Valid @RequestBody ImportRequest request) {
        return ResponseEntity.ok(importProcessorService.process(request));
    }

    @PostMapping("/importDevice")
    public ResponseEntity<HoldableResultResponse<?>> importAndCreateDevice(
        @Valid @RequestBody ImportCreateRequest request,
        HttpServletRequest servletRequest) {
        return ResponseEntity.ok(importCreateProcessorService.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }

    @PostMapping("/deleteDevice")
    public ResponseEntity<OperationResultResponse> deleteDevice(@Valid @RequestBody DeviceDeleteRequest request,
        HttpServletRequest servletRequest) {
        return ResponseEntity.ok(deleteDeviceProcessorService.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }
    
    
}
