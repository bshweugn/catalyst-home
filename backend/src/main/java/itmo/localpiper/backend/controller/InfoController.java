package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import itmo.localpiper.backend.dto.request.EntityInfoRequest;
import itmo.localpiper.backend.dto.response.InfoResponse;
import itmo.localpiper.backend.service.processing.GetInfoProcessorService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/info")
public class InfoController {

    @Autowired
    private GetInfoProcessorService getInfoProcessorService;
    
    @GetMapping("/retrieve")
    public ResponseEntity<InfoResponse> getMethodName(
        @Valid @RequestBody EntityInfoRequest request) {
        return ResponseEntity.ok(getInfoProcessorService.process(request));
    }
    
}
