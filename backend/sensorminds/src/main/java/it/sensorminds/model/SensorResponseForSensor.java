package it.sensorminds.model;

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
    private String type;

    private Date start;

    private Date end;

    private List<SensorTimeSeriesData> data;

}
