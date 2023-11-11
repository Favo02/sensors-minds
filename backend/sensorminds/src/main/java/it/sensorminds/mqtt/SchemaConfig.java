package it.sensorminds.mqtt;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
    public class SchemaConfig {
        private String type;
        private String field;
        private String unit;
        private String topicString;

        // Getters and setters
    }
