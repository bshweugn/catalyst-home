package itmo.localpiper.backend.model;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import itmo.localpiper.backend.util.JsonConverter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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

    @Convert(converter = JsonConverter.class)
    @Column(name = "features", nullable=false)
    private Map<String, Object> features;    

    @ManyToOne
    @JoinColumn(name="room_id", nullable=false)
    @JsonBackReference
    private Room room;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<UserDeviceActionRel> userDeviceActionRels;

    @ManyToMany(mappedBy="devices")
    private List<TriggerCondition> triggerConditions;

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        node.put("name", name);
        node.put("device_type", deviceType);
        node.put("status", status);
        node.put("battery_level", batteryLevel);
        node.put("charging", charging);
        node.set("features", objectMapper.valueToTree(features));
        try {
            node.set("room", objectMapper.readTree(room.toJson()));
        } catch (JsonProcessingException e) {
        }
        return node.toString();
    }
}
