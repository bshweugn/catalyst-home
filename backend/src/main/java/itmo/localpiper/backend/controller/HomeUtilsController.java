package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.AddFloorRequest;
import itmo.localpiper.backend.dto.request.AddHouseRequest;
import itmo.localpiper.backend.dto.request.AddRoomRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.AddFloorProcessor;
import itmo.localpiper.backend.service.processing.AddHouseProcessor;
import itmo.localpiper.backend.service.processing.AddRoomProcessor;


@RestController
@RequestMapping("/api/user")
public class HomeUtilsController {

    @Autowired
    private AddHouseProcessor addHouseProcessor;

    @Autowired
    private AddFloorProcessor addFloorProcessor;

    @Autowired
    private AddRoomProcessor addRoomProcessor;
    
    @PostMapping("/addHouse")
    public ResponseEntity<OperationResultResponse> addHouse(@RequestBody AddHouseRequest request) {

        return ResponseEntity.ok(addHouseProcessor.process(request));
    }

    @PostMapping("/addFloor")
    public ResponseEntity<OperationResultResponse> addFloor(@RequestBody AddFloorRequest request) {

        return ResponseEntity.ok(addFloorProcessor.process(request));
    }

    @PostMapping("/addRoom")
    public ResponseEntity<OperationResultResponse> addRoom(@RequestBody AddRoomRequest request) {

        return ResponseEntity.ok(addRoomProcessor.process(request));
    }
}
