package itmo.localpiper.backend.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_device_action_rels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDeviceActionRel {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name="device_id", nullable =false)
    private Device device;

    @Column(name="action")
    private String action;

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        try {
            node.set("user", objectMapper.readTree(user.toJson()));
        } catch (JsonProcessingException e) {
        }
        try {
            node.set("device", objectMapper.readTree(device.toJson()));
        } catch (JsonProcessingException e) {
        }
        node.put("action", action);
        return node.toString();
    }
}
