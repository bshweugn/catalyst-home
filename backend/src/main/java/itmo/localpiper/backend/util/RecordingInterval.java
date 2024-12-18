package itmo.localpiper.backend.util;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecordingInterval {
    private ZonedDateTime from;
    
    private ZonedDateTime to;
}
