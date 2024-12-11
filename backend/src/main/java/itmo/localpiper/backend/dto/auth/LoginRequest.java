package itmo.localpiper.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequest {

    @NotNull
    @NotBlank
    @Email
    private String email;

    @NotNull
    @NotBlank
    @Size(min=6)
    private String password;
}
