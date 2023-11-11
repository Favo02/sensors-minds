package it.sensorminds.service;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.annotation.ServiceActivator;


public interface MqttService {


    void handleMessage(String payload);
}
