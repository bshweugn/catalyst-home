package itmo.localpiper.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.response.FullDataResponse;
import itmo.localpiper.backend.model.Action;
import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Location;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.Script;
import itmo.localpiper.backend.model.TriggerCondition;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.model.VideoRecording;
import itmo.localpiper.backend.service.entity.ActionService;
import itmo.localpiper.backend.service.entity.CameraService;
import itmo.localpiper.backend.service.entity.DeviceService;
import itmo.localpiper.backend.service.entity.FloorService;
import itmo.localpiper.backend.service.entity.HouseService;
import itmo.localpiper.backend.service.entity.LocationService;
import itmo.localpiper.backend.service.entity.RoomService;
import itmo.localpiper.backend.service.entity.ScriptService;
import itmo.localpiper.backend.service.entity.TriggerConditionService;
import itmo.localpiper.backend.service.entity.UserDeviceActionRelService;
import itmo.localpiper.backend.service.entity.UserService;
import itmo.localpiper.backend.service.entity.VideoRecordingService;


@RestController
@RequestMapping("/api/data")
public class DataFetchController {
    
    @Autowired
    private ActionService actionService;

    @Autowired
    private CameraService cameraService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private FloorService floorService;

    @Autowired
    private HouseService houseService;

    @Autowired
    private LocationService locationService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private ScriptService scriptService;

    @Autowired
    private TriggerConditionService triggerConditionService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserDeviceActionRelService udarService;

    @Autowired
    private VideoRecordingService videoRecordingService;

    @GetMapping("/action")
    public ResponseEntity<List<Action>> getActions() {
        return ResponseEntity.ok(actionService.read());
    }

    @GetMapping("/camera")
    public ResponseEntity<List<Camera>> getCameras() {
        return ResponseEntity.ok(cameraService.read());
    }

    @GetMapping("/device")
    public ResponseEntity<List<Device>> getDevices() {
        return ResponseEntity.ok(deviceService.read());
    }

    @GetMapping("/floor")
    public ResponseEntity<List<Floor>> getFloors() {
        return ResponseEntity.ok(floorService.read());
    }

    @GetMapping("/house")
    public ResponseEntity<List<House>> getHouses() {
        return ResponseEntity.ok(houseService.read());
    }

    @GetMapping("/location")
    public ResponseEntity<List<Location>> getLocations() {
        return ResponseEntity.ok(locationService.read());
    }

    @GetMapping("/room")
    public ResponseEntity<List<Room>> getRooms() {
        return ResponseEntity.ok(roomService.read());
    }

    @GetMapping("/script")
    public ResponseEntity<List<Script>> getScripts() {
        return ResponseEntity.ok(scriptService.read());
    }

    @GetMapping("/trigger")
    public ResponseEntity<List<TriggerCondition>> getTriggers() {
        return ResponseEntity.ok(triggerConditionService.read());
    }

    @GetMapping("/user")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.read());
    }

    @GetMapping("/udar")
    public ResponseEntity<List<UserDeviceActionRel>> getUdars() {
        return ResponseEntity.ok(udarService.read());
    }

    @GetMapping("/video")
    public ResponseEntity<List<VideoRecording>> getVideos() {
        return ResponseEntity.ok(videoRecordingService.read());
    }

    @GetMapping("/all")
    public ResponseEntity<FullDataResponse> getMethodName() {
        return ResponseEntity.ok(
            FullDataResponse.builder()
            .actions(actionService.read())
            .cameras(cameraService.read())
            .devices(deviceService.read())
            .floors(floorService.read())
            .houses(houseService.read())
            .locations(locationService.read())
            .rooms(roomService.read())
            .scripts(scriptService.read())
            .triggerConditions(triggerConditionService.read())
            .users(userService.read())
            .userDeviceActionRels(udarService.read())
            .videoRecordings(videoRecordingService.read())
            .build()
        );
    }
    
    
}
