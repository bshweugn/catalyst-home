package itmo.localpiper.backend.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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

    @Column(name="camera_type", nullable=false)
    private String camera_type;

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
    private Room room;

    @ManyToMany(mappedBy="cameras")
    private List<TriggerCondition> triggerConditions;
}
