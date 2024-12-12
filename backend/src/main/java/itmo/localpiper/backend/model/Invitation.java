package itmo.localpiper.backend.model;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import itmo.localpiper.backend.util.InvitationAction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invitation {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="house_id")
    private House house;

    @Column(name="host_name", nullable=false)
    private String hostName;

    @Column(name="guest_email", nullable =false)
    private String guestEmail;

    @Column(name="is_resident", nullable=false)
    private Boolean isResident;

    @Lob
    @Column(name = "actions", columnDefinition = "TEXT")
    private String actions;

    public List<InvitationAction> getActionsAsList() throws JsonProcessingException {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(actions, new TypeReference<List<InvitationAction>>() {});
        }

    public void setActionsFromList(List<InvitationAction> actionList) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        this.actions = mapper.writeValueAsString(actionList);
    }

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("id", id);
        node.put("house", house.getName());
        node.put("host_name", hostName);
        node.put("guest_email", guestEmail);
        node.put("is_resident", isResident);
        
        return node.toString();
    }

}
