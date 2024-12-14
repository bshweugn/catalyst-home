package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.ImportCreateRequest;
import itmo.localpiper.backend.dto.request.ImportRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.ImportResultResponse;
import itmo.localpiper.backend.service.processing.ImportCreateProcessorService;
import itmo.localpiper.backend.service.processing.ImportProcessorService;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/create")
public class DeviceImportController {
    
    @Autowired
    private ImportProcessorService importProcessorService;

    @Autowired
    private ImportCreateProcessorService importCreateProcessorService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/checkDevice")
    public ResponseEntity<ImportResultResponse> checkDeviceNumber(
        @Valid @RequestBody ImportRequest request) {
        return ResponseEntity.ok(importProcessorService.process(request));
    }

    @PostMapping("/importDevice")
    public ResponseEntity<HoldableResultResponse<?>> importAndCreateDevice(
        @Valid @RequestBody ImportCreateRequest request,
        HttpServletRequest servletRequest) {
            String token = servletRequest.getHeader("Authorization").substring(7);
            Pair<String, ImportCreateRequest> crutch = Pair.of(jwtService.extractUsername(token), request);
        return ResponseEntity.ok(importCreateProcessorService.process(crutch));
    }
    
    
}
