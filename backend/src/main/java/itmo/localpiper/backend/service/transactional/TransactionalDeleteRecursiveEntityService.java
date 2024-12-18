package itmo.localpiper.backend.service.transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.Device;
import itmo.localpiper.backend.model.Floor;
import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.Room;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserCameraActionRel;
import itmo.localpiper.backend.model.UserDeviceActionRel;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.DeviceRepository;
import itmo.localpiper.backend.repository.FloorRepository;
import itmo.localpiper.backend.repository.HouseRepository;
import itmo.localpiper.backend.repository.RoomRepository;
import itmo.localpiper.backend.repository.UserCameraActionRelRepository;
import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;
import itmo.localpiper.backend.repository.UserHouseRelRepository;

@Service
public class TransactionalDeleteRecursiveEntityService {

    @Autowired
    private UserHouseRelRepository uhrRepository;

    @Autowired
    private UserDeviceActionRelRepository udarRepository;

    @Autowired
    private UserCameraActionRelRepository ucarRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private RoomRepository roomRepository;
    
    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void deleteHouse(House house) {
        List<User> users = uhrRepository.findAllUsersByHouse(house.getId());
        List<Device> devices = deviceRepository.findAllByHouseId(house.getId());
        List<Camera> cameras = cameraRepository.findAllByHouseId(house.getId());
        for (User user : users) {
            for (Device device : devices) {
                List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(user, device);
                udarRepository.deleteAll(udars);
            }
            for (Camera camera : cameras) {
                List<UserCameraActionRel> ucars = ucarRepository.findAllByUserAndCamera(user, camera);
                ucarRepository.deleteAll(ucars);
            }
            uhrRepository.delete(uhrRepository.findByUserAndHouse(user, house).orElse(null));
        }
        houseRepository.delete(house);
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void deleteFloor(Floor floor) {
        List<User> users = uhrRepository.findAllUsersByHouse(floor.getHouse().getId());
        List<Device> devices = deviceRepository.findAllByFloorId(floor.getId());
        List<Camera> cameras = cameraRepository.findAllByFloorId(floor.getId());
        for (User user : users) {
            for (Device device : devices) {
                List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(user, device);
                udarRepository.deleteAll(udars);
            }
            for (Camera camera : cameras) {
                List<UserCameraActionRel> ucars = ucarRepository.findAllByUserAndCamera(user, camera);
                ucarRepository.deleteAll(ucars);
            }
        }
        floorRepository.delete(floor);
    }

    @Transactional(isolation= Isolation.REPEATABLE_READ, propagation=Propagation.REQUIRED)
    public void deleteRoom(Room room) {
        List<User> users = uhrRepository.findAllUsersByHouse(room.getFloor().getHouse().getId());
        List<Device> devices = room.getDevices();
        List<Camera> cameras = room.getCameras();
        for (User user : users) {
            for (Device device : devices) {
                List<UserDeviceActionRel> udars = udarRepository.findAllByUserAndDevice(user, device);
                udarRepository.deleteAll(udars);
            }
            for (Camera camera : cameras) {
                List<UserCameraActionRel> ucars = ucarRepository.findAllByUserAndCamera(user, camera);
                ucarRepository.deleteAll(ucars);
            }
        }
        roomRepository.delete(room);
    }
}
