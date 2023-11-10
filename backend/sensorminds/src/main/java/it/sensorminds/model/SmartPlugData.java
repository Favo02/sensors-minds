package it.sensorminds.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class SmartPlugData {
    private Integer id;
    private String source;
    private Boolean output;
    private Double apower;
    private Double voltage;
    private Double current;
    private Aenergy aenergy;
    private Temperature temperature;

    @Getter
    @Setter
    public static class Aenergy {
        private Double total;
        private List<Double> by_minute;
        private Long minute_ts;
    }

    @Getter
    @Setter
    public static class Temperature {
        @JsonProperty("tC")
        private Double tc;
        @JsonProperty("tF")
        private Double tf;
    }
}
