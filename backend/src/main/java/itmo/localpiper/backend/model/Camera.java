package itmo.localpiper.backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="cameras")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Camera {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", nullable=false)
    private String name;

    @Column(name="camera_type", nullable=false)
    private String cameraType;

    @Column(name="status", nullable = false)
    private String status;

    @Column(name="battery_level")
    private Integer batteryLevel;

    @Column(name="charging")
    private Boolean charging;

    @Column(name="motion_sensor_enabled", nullable = false)
    private Boolean motionSensorEnabled;

    @Column(name="x_rotate_percent")
    private Integer xRotatePercent;

    @Column(name="y_rotate_percent")
    private Integer yRotatePercent;

    @Column(name="is_recording", nullable = false)
    private Boolean isRecording;

    @ManyToOne
    @JoinColumn(name="room_id", nullable=false)
    @JsonBackReference
    private Room room;

    @OneToMany(mappedBy = "camera", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<UserCameraActionRel> userCameraActionRels;

    @ManyToMany(mappedBy="cameras")
    private List<TriggerCondition> triggerConditions;
    
    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        node.put("name", name);
        node.put("camera_type", cameraType);
        node.put("status", status);
        node.put("battery_level", batteryLevel);
        node.put("charging", charging);
        node.put("motion_sensor_enabled", motionSensorEnabled);
        node.put("x_rotate_percent", xRotatePercent);
        node.put("y_rotate_percent", yRotatePercent);
        node.put("is_recording", isRecording);
        try {
            node.set("room", objectMapper.readTree(room.toJson()));
        } catch (JsonProcessingException e) {
        }
        return node.toString();
    }
}
