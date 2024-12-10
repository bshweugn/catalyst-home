package itmo.localpiper.backend.dto.response;

import java.util.List;

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
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FullDataResponse {
    
    private List<Action> actions;

    private List<Camera> cameras;

    private List<Device> devices;

    private List<Floor> floors;

    private List<House> houses;

    private List<Location> locations;

    private List<Room> rooms;

    private List<Script> scripts;

    private List<TriggerCondition> triggerConditions;

    private List<User> users;

    private List<UserDeviceActionRel> userDeviceActionRels;

    private List<VideoRecording> videoRecordings;
}
