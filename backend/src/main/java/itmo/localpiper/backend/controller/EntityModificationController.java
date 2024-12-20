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
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/modify")
public class EntityModificationController {
    
    @Autowired
    private ModifyRenameProcessorService modifyRenameProcessorService;

    @Autowired
    private ModifyMoveProcessorService modifyMoveProcessorService;

    @Autowired
    private RequestTransformer requestTransformer;

    @PostMapping("/rename")
    public ResponseEntity<OperationResultResponse> renameEntity(
        @Valid @RequestBody EntityRenameRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(modifyRenameProcessorService.process(requestTransformer.transform(request, servletRequest)));
    }

    @PostMapping("/move")
    public ResponseEntity<OperationResultResponse> moveEntity(
        @Valid @RequestBody EntityMoveRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(modifyMoveProcessorService.process(requestTransformer.transform(request, servletRequest)));
    }
}
