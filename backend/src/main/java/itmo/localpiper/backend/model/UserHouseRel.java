package itmo.localpiper.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import itmo.localpiper.backend.util.enums.HouseOwnership;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_houses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserHouseRel {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "house_id")
    @JsonBackReference
    private House house;

    @Column(name="role")
    private HouseOwnership role;

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        try {
            node.set("user", objectMapper.readTree(user.toJson()));
        } catch (JsonProcessingException e) {
        }
        try {
            node.set("house", objectMapper.readTree(house.toJson()));
        } catch (JsonProcessingException e) {
        }
        node.put("role", role.toString());
        
        return node.toString();
    }
}
