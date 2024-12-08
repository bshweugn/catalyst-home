package itmo.localpiper.backend.model;

import java.util.List;
import java.util.Map;

import itmo.localpiper.backend.util.JsonConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
@Table(name="devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", nullable=false)
    private String name;

    @Column(name="device_type", nullable = false)
    private String deviceType;

    @Column(name="status", nullable = false)
    private String status;

    @Column(name="battery_level")
    private Integer batteryLevel;

    @Column(name="charging")
    private Boolean charging;

    @Convert(converter=JsonConverter.class)
    @Column(name="features", columnDefinition="json")
    private Map<String, Object> features;

    @ManyToOne
    @JoinColumn(name="room_id", nullable=false)
    private Room room;

    @ManyToMany(mappedBy="devices")
    private List<TriggerCondition> triggerConditions;
}
