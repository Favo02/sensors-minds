package it.sensorminds.mqtt;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sensorminds.enumerator.SensorType;
import it.sensorminds.model.SensorDataModel;
import it.sensorminds.model.SmartPlugData;
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

@Configuration
@EnableIntegration
public class MqttConfig {

    // Define your MQTT broker URL and other properties in application.properties or application.yml

    @Autowired
    SensorDataService dataService;
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("tcp://andrea-ENVY.local:1883", "testClient",
                        "+/status/switch:0");
        adapter.setCompletionTimeout(5000000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
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

                    ObjectMapper mapper = new ObjectMapper();
                    try {
                        SmartPlugData m = mapper.readValue( message.getPayload().toString(), SmartPlugData.class);
                        System.out.println("MOUT");
                        System.out.println(m.toString());
                        dataService.persistSensorData(SensorDataModel.builder()
                                        .value(m.getApower().floatValue())
                                        .type(getType(topic))
                                        .sensorName(getTopicName(topic))
                                .build());

                        // Process the message as needed
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

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
       return topic.split("/")[0];
    }
    private SensorType getType(String topic) {

        if (topic.startsWith("plug")){
            return SensorType.PWR;
        } else if (topic.startsWith("temp")){
            return SensorType.TEMP;
        }

        return null;

    }

}
