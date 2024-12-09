package itmo.localpiper.backend.util;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class FeatureDefinition {
    private String type;
    private Integer min;
    private Integer max;

    @JsonProperty("values")
    private List<String> values;
    private String format;
}

