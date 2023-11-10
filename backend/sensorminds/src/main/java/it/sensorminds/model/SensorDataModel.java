package it.sensorminds.model;

import it.sensorminds.enumerator.SensorType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class SensorDataModel {

    private String sensorName;
    private Float value;

    private SensorType type;
}
