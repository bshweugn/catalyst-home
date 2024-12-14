package itmo.localpiper.backend.controller.usermode;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestParam;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;



@RestController
@RequestMapping("/api/local")
public class LocalDataFetchController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserHouseRelRepository userHouseRelRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private CameraRepository cameraRepository;
    
    @GetMapping("/getUserData")
    public ResponseEntity<User> getUserData(HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
            userRepository.findByEmail(
            jwtService.extractEmail(
            servletRequest.getHeader("Authorization").substring(7))).get());
    }

    @GetMapping("/getUsersByHouse")
    public ResponseEntity<List<User>> getUsersByHouse(@RequestParam Long houseId) {
        return ResponseEntity.ok(
            userHouseRelRepository.findAllUsersByHouse(houseId)
        );
    }

    @GetMapping("/getHousesByUser")
    public ResponseEntity<List<House>> getHousesByUser(HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
            userHouseRelRepository.findAllHousesByUser(
                userRepository.findByEmail(
                    jwtService.extractEmail(
                        servletRequest.getHeader("Authorization").substring(7)
                    )
                ).get().getId()
            )
        );
    }

    @GetMapping("/getDevicesByHouse")
    public ResponseEntity<List<Device>> getDevicesByHouse(@RequestParam Long houseId) {
        return ResponseEntity.ok(
            deviceRepository.findAllByHouseId(houseId)
        );
    }
    
    @GetMapping("/getCamerasByHouse")
    public ResponseEntity<List<Camera>> getMethodName(@RequestParam Long houseId) {
        return ResponseEntity.ok(
            cameraRepository.findAllByHouseId(houseId)
        );
    }
    
    
    
}
