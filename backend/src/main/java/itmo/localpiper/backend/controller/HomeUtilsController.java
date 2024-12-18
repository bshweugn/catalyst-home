package itmo.localpiper.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.request.homeutils.AddFloorRequest;
import itmo.localpiper.backend.dto.request.homeutils.AddHouseRequest;
import itmo.localpiper.backend.dto.request.homeutils.AddLocationRequest;
import itmo.localpiper.backend.dto.request.homeutils.AddRoomRequest;
import itmo.localpiper.backend.dto.response.HoldableResultResponse;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.service.processing.homeutils.AddFloorProcessorService;
import itmo.localpiper.backend.service.processing.homeutils.AddHouseProcessorService;
import itmo.localpiper.backend.service.processing.homeutils.AddRoomProcessorService;
import itmo.localpiper.backend.service.processing.homeutils.DeleteFloorProcessorService;
import itmo.localpiper.backend.service.processing.homeutils.DeleteHouseProcessorService;
import itmo.localpiper.backend.service.processing.homeutils.DeleteRoomProcessorService;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/user")
public class HomeUtilsController {

    @Autowired
    private AddHouseProcessorService addHouseProcessorService;

    @Autowired
    private AddFloorProcessorService addFloorProcessorService;

    @Autowired
    private AddRoomProcessorService addRoomProcessorService;

    @Autowired
    private DeleteHouseProcessorService deleteHouseProcessorService;

    @Autowired
    private DeleteFloorProcessorService deleteFloorProcessorService;

    @Autowired
    private DeleteRoomProcessorService deleteRoomProcessorService;

    @Autowired
    private RequestTransformer requestTransformer;

    @Autowired
    private LocationService locationService;
    
    @PostMapping("/addLocation")
    public ResponseEntity<Location> addLocation(@RequestBody AddLocationRequest request) {
        return ResponseEntity.ok(locationService.create(request.getName(), request.getX(), request.getY()));
    }

    @PostMapping("/addHouse")
    public ResponseEntity<HoldableResultResponse<House>> addHouse(
        @Valid @RequestBody AddHouseRequest request,
        HttpServletRequest servletRequest) {
        return ResponseEntity.ok(addHouseProcessorService.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }

    @PostMapping("/addFloor")
    public ResponseEntity<HoldableResultResponse<Floor>> addFloor(
        @Valid @RequestBody AddFloorRequest request,
        HttpServletRequest servletRequest) {
        return ResponseEntity.ok(addFloorProcessorService.process(
            requestTransformer.transform(request, servletRequest)
        ));
    }
    
    @PostMapping("/addRoom")
    public ResponseEntity<HoldableResultResponse<Room>> addRoom(
        @Valid @RequestBody AddRoomRequest request,
        HttpServletRequest servletRequest) {
        return ResponseEntity.ok(addRoomProcessorService.process(
                requestTransformer.transform(request, servletRequest)));
    }

    @PostMapping("/deleteHouse")
    public ResponseEntity<OperationResultResponse> deleteHouse(@RequestBody Long houseId,
    HttpServletRequest servletRequest) {        
        return ResponseEntity.ok(
            deleteHouseProcessorService.process(
                requestTransformer.transform(houseId, servletRequest)
            )
        );
    }

    @PostMapping("/deleteFloor")
    public ResponseEntity<OperationResultResponse> deleteFloor(@RequestBody Long floorId,
    HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
            deleteFloorProcessorService.process(
                requestTransformer.transform(floorId, servletRequest)
            )
        );
    }

    @PostMapping("/deleteRoom")
    public ResponseEntity<OperationResultResponse> deleteRoom(@RequestBody Long roomId,
    HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
            deleteRoomProcessorService.process(
                requestTransformer.transform(roomId, servletRequest)
            )
        );
    }
    
    
    
}
