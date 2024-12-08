package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.ImportRequest;
import itmo.localpiper.backend.dto.response.ImportResultResponse;
import itmo.localpiper.backend.service.processing.ImportProcessorService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/create")
public class EntityCreationController {
    
    @Autowired
    private ImportProcessorService createImportProcessorService;

    @PostMapping("/import")
    public ResponseEntity<ImportResultResponse> importDevice(@Valid @RequestBody ImportRequest request) {
        return ResponseEntity.ok(createImportProcessorService.process(request));
    }

    @PostMapping("/import_create")
    public String importAndCreateDevice(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
    
}
