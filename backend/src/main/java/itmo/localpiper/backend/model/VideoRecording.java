package itmo.localpiper.backend.model;

import java.time.LocalDateTime;

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
@Table(name="video_recordings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoRecording {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="time", nullable=false)
    private LocalDateTime time;

    @Column(name="source", nullable =false)
    private String source;

    @ManyToOne
    @JoinColumn(name="camera_id", nullable=false)
    @JsonBackReference
    private Camera camera;

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        node.put("time", time.toString());
        node.put("source", source);
        try {
            node.set("camera", objectMapper.readTree(camera.toJson()));
        } catch (JsonProcessingException e) {
        }
        return node.toString();
    }
}
