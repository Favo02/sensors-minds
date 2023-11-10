package it.sensorminds.service;
import org.springframework.stereotype.Service;

@Service
public class MqttServiceImpl implements MqttService {

    @Override
    public void handleMessage(String payload) {
        // Handle the incoming MQTT message here
        System.out.println("Received MQTT message: " + payload);
        // Implement your processing logic
    }
}
