package it.sensorminds.model;

import it.sensorminds.enumerator.SensorType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SensorResponseForType extends Page{

    private SensorType type;

    private List<SensorTimeSeriesData> data;
}
