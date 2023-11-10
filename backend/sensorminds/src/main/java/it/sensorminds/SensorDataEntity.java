package it.sensorminds;

import it.sensorminds.enumerator.SensorType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@ToString
@Document(collection = "sensorData")
public class SensorDataEntity {

    @Id
    private String id;

    private String sensorname;
    private Date timestamp;
    private SensorType type;
    private Float value;

    // Getters and setters for all fields
    // ...
}
