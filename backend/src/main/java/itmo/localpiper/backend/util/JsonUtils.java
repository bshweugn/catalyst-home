package itmo.localpiper.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public class JsonUtils {

    private static final ObjectMapper objectMapper = createObjectMapper();

    private static ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        return mapper;
    }

    /**
     * Transforms any Java entity into a JSON string.
     *
     * @param entity the entity to be transformed
     * @return the JSON string representation of the entity
     * @throws RuntimeException if the transformation fails
     */
    public static String toJson(Object entity) {
        try {
            return objectMapper.writeValueAsString(entity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert entity to JSON", e);
        }
    }

    /**
     * Transforms any Java entity into a pretty-printed JSON string.
     *
     * @param entity the entity to be transformed
     * @return the pretty-printed JSON string representation of the entity
     * @throws RuntimeException if the transformation fails
     */
    public static String toPrettyJson(Object entity) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(entity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert entity to JSON", e);
        }
    }
}

