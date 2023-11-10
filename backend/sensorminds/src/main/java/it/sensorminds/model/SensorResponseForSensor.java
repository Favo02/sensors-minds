package it.sensorminds.model;

import it.sensorminds.enumerator.SensorType;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SensorResponseForSensor extends Page {

    private String name;
    private SensorType type;

    private Date start;

    private Date end;

    private List<SensorTimeSeriesData> data;

}
