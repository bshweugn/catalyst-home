package itmo.localpiper.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name="scripts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Script {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="action")
    private String action;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name="trigger_condition_id", nullable = false)
    @JsonBackReference
    private TriggerCondition triggerCondition;

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        node.put("name", name);
        node.put("action", action);
        try {
            node.set("user", objectMapper.readTree(user.toJson()));
        } catch (JsonProcessingException e) {
        }
        return node.toString();
    }
}
