package itmo.localpiper.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserData {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="login", nullable=false)
    private String login;

    @Column(name="password", nullable=false)
    private String password;

    @OneToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

}
