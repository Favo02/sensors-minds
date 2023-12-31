package it.sensorminds.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class SensorResponseForType extends Page{

    private String type;

    private Date start;

    private Date end;

    private List<SensorTimeSeriesData> data;
}
