package itmo.localpiper.backend.util;

import java.io.IOException;
import java.lang.reflect.Field;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class EntitySerializer extends JsonSerializer<Object> {

    @Override
    public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        // Start writing JSON object
        ObjectNode node = (ObjectNode) gen.getCodec().createObjectNode();

        // Get the class type of the entity
        Class<?> entityClass = value.getClass();

        // Iterate over all fields in the entity
        for (Field field : entityClass.getDeclaredFields()) {
            field.setAccessible(true);

            // Skip fields that are not relevant (serialVersionUID, _children, etc.)
            if (isIgnoredField(field)) return;

            try {
                if (isToMany(field)) continue;
                if (isToOne(field)) {
                    // If it's a single related entity, get its ID
                    Object relatedEntity = field.get(value);
                    if (relatedEntity != null) {
                        // Add related entity's ID to the JSON
                        node.put(field.getName(), (Long) getId(relatedEntity));
                    } else {
                        node.putNull(field.getName());
                    }
                } else {
                    // For simple fields, serialize normally
                    node.putPOJO(field.getName(), field.get(value));
                }
            } catch (IllegalAccessException e) {
                // Handle case where field cannot be accessed
                throw new RuntimeException("Failed to access field: " + field.getName(), e);
            } catch (Exception e) {
                // Handle any other reflection-related exceptions
                throw new RuntimeException("Failed to serialize field: " + field.getName(), e);
            }
        }

        // Write the final JSON node
        gen.writeTree(node);
    }

    // Utility method to check if the field is a relation (e.g., @ManyToOne, @ManyToMany, @OneToMany)
    private boolean isToOne(Field field) {
        return field.isAnnotationPresent(jakarta.persistence.ManyToOne.class) ||
               field.isAnnotationPresent(jakarta.persistence.OneToOne.class);
    }

    private boolean isToMany(Field field) {
        return field.isAnnotationPresent(jakarta.persistence.ManyToMany.class) ||
               field.isAnnotationPresent(jakarta.persistence.OneToMany.class);
    }

    // Utility method to check if the field is something we should ignore (e.g., serialVersionUID, _children)
    private boolean isIgnoredField(Field field) {
        return field.getName().equals("serialVersionUID") || field.getName().startsWith("_children");
    }

    // Utility method to get the ID of a related entity
    private Object getId(Object entity) {
        try {
            // Assuming all related entities have a getId() method
            return entity.getClass().getMethod("getId").invoke(entity);
        } catch (Exception e) {
            throw new RuntimeException("Error getting ID from related entity", e);
        }
    }
}
