package itmo.localpiper.backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="trigger_conditions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TriggerCondition {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="condition")
    private String condition;

    @Column(name="is_active")
    private Boolean isActive;
    
    @OneToMany(mappedBy = "triggerCondition", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Script> scripts;

    @ManyToOne
    @JoinColumn(name="camera_id", nullable=true)
    @JsonBackReference
    private Camera camera;

    @ManyToOne
    @JoinColumn(name="device_id", nullable=true)
    @JsonBackReference
    private Device device;

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        node.put("name", name);
        node.put("condition", condition);

        return node.toString();
    }
}
