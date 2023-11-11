package it.sensorminds.mqtt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Setter
@Getter
public class AppConfig {
    private String mqttBrokerUrl;


    private Map<String, SchemaConfig> schemas;

    // Getters and setters


}
