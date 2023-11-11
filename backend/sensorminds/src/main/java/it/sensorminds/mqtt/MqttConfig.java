package it.sensorminds.mqtt;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sensorminds.model.SensorDataModel;
import it.sensorminds.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Configuration
@EnableIntegration
public class MqttConfig {

    // Define your MQTT broker URL and other properties in application.properties or application.yml

    @Autowired
    SensorDataService dataService;


    private AppConfig appConfig;

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageProducer inbound() {

        loadConfig();

        String[] topics = appConfig.getSchemas().keySet().stream().map(k -> appConfig.getSchemas().get(k).getTopicString()).toArray(String[]::new);
        String clientId = UUID.randomUUID().toString();
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(appConfig.getMqttBrokerUrl(), clientId,
                        topics);
        adapter.setCompletionTimeout(5000000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    private void loadConfig() {

        Yaml yaml = new Yaml(new Constructor(AppConfig.class));
        try (InputStream inputStream = Files.newInputStream(Paths.get("src/main/resources/app-config.yaml"))) {
            appConfig = yaml.load(inputStream);

            // Do something with 'person' object
        } catch (Exception e) {
            appConfig = null;
            e.printStackTrace();
        }
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return new MessageHandler() {

            @Override
            public void handleMessage(Message<?> message) throws MessagingException {
                try {
                    System.out.println(message.getPayload().toString());
                    System.out.println(message.getHeaders().get("mqtt_receivedTopic"));
                    String topic = (String)message.getHeaders().get("mqtt_receivedTopic");

                    SchemaConfig config = appConfig.getSchemas().get(topic.split("/")[0]);

                    ObjectMapper mapper = new ObjectMapper();

                    Set<String> sensors = appConfig.getSchemas().keySet();

                    dataService.persistSensorData(SensorDataModel.builder()
                            .value(Float.parseFloat(extractFieldFromJson(message.getPayload().toString(), config.getField())))
                            .type(config.getType())
                            .sensorName(getTopicName(topic))
                            .build());



                    /*
                    true
mqtt_receivedRetained
mqtt_id
mqtt_duplicate
id
mqtt_receivedTopic
mqtt_receivedQos
timestamp
                     */
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

        };
    }

    private String getTopicName(String topic){
       return topic.split("/")[1];
    }


    public String extractFieldFromJson(String json, String fieldName) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(json);
            JsonNode fieldNode = jsonNode.get(fieldName);
            if (fieldNode != null) {
                return fieldNode.asText();
            }
            return null; // or throw an exception if the field is mandatory
        } catch (Exception e) {
            e.printStackTrace();
            return null; // or rethrow a custom exception
        }
    }

}
