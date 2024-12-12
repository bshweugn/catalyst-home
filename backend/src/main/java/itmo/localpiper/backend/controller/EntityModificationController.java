package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.EntityMoveRequest;
import itmo.localpiper.backend.dto.request.EntityRenameRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.ModifyMoveProcessorService;
import itmo.localpiper.backend.service.processing.ModifyRenameProcessorService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/modify")
public class EntityModificationController {
    
    @Autowired
    private ModifyRenameProcessorService modifyRenameProcessorService;

    @Autowired
    private ModifyMoveProcessorService modifyMoveProcessorService;

    @PostMapping("/rename")
    public ResponseEntity<OperationResultResponse> renameEntity(
        @Valid @RequestBody EntityRenameRequest request) {
        return ResponseEntity.ok(modifyRenameProcessorService.process(request));
    }

    @PostMapping("/move")
    public ResponseEntity<OperationResultResponse> moveEntity(
        @Valid @RequestBody EntityMoveRequest request) {
        return ResponseEntity.ok(modifyMoveProcessorService.process(request));
    }
}
