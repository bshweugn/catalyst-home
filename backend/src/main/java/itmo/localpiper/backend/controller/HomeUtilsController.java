package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.AddFloorRequest;
import itmo.localpiper.backend.dto.request.AddHouseRequest;
import itmo.localpiper.backend.dto.request.AddRoomRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.service.processing.AddFloorProcessor;
import itmo.localpiper.backend.service.processing.AddHouseProcessor;
import itmo.localpiper.backend.service.processing.AddRoomProcessor;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/user")
public class HomeUtilsController {

    @Autowired
    private AddHouseProcessor addHouseProcessor;

    @Autowired
    private AddFloorProcessor addFloorProcessor;

    @Autowired
    private AddRoomProcessor addRoomProcessor;

    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/addHouse")
    public ResponseEntity<HoldableResultResponse<House>> addHouse(
        @Valid @RequestBody AddHouseRequest request,
        HttpServletRequest servletRequest) {
            String token = servletRequest.getHeader("Authorization").substring(7);
            Pair<String, AddHouseRequest> crutch = Pair.of(jwtService.extractUsername(token), request);
        return ResponseEntity.ok(addHouseProcessor.process(crutch));
    }

    @PostMapping("/addFloor")
    public ResponseEntity<HoldableResultResponse<Floor>> addFloor(
        @Valid @RequestBody AddFloorRequest request,
        HttpServletRequest servletRequest) {
            String token = servletRequest.getHeader("Authorization").substring(7);
            Pair<String, AddFloorRequest> crutch = Pair.of(jwtService.extractUsername(token), request);
        return ResponseEntity.ok(addFloorProcessor.process(crutch));
    }
    
    @PostMapping("/addRoom")
    public ResponseEntity<HoldableResultResponse<Room>> addRoom(
        @Valid @RequestBody AddRoomRequest request,
        HttpServletRequest servletRequest) {
            String token = servletRequest.getHeader("Authorization").substring(7);
            Pair<String, AddRoomRequest> crutch = Pair.of(jwtService.extractUsername(token), request);
        return ResponseEntity.ok(addRoomProcessor.process(crutch));
    }
}
