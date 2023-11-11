package it.sensorminds.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class SensorTimeSeriesData {

    private Date timestamp;

    private float value;
}
