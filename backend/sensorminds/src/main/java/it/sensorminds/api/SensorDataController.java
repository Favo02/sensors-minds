package it.sensorminds.api;

import it.sensorminds.SensorDataEntity;
import it.sensorminds.enumerator.SensorType;
import it.sensorminds.model.SensorList;
import it.sensorminds.model.SensorResponseForSensor;
import it.sensorminds.model.SensorResponseForType;
import it.sensorminds.model.SensorTimeSeriesData;
import it.sensorminds.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping()
public class SensorDataController {


    @Autowired
    SensorDataService service;
    @GetMapping("/data/{sensorname}")
    public SensorResponseForSensor getDataForSensorName(@PathVariable String sensorname,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {

        Page<SensorDataEntity> result = service.getSensorDataBySensorName(sensorname, PageRequest.of(page, size));

        SensorResponseForSensor response = new SensorResponseForSensor();
        response.setPage(result.getNumber());
        response.setSize(result.getNumberOfElements());
        response.setTotalPages(result.getTotalPages());
        if(result.isEmpty())return null;
        response.setName(result.getContent().get(0).getSensorname());
        response.setType(result.getContent().get(0).getType());
        response.setStart(result.getContent().get(0).getTimestamp());
        response.setEnd(result.getContent().get(result.getSize()-1).getTimestamp());

        response.setData(result.stream().map(r -> new SensorTimeSeriesData(r.getTimestamp(), r.getValue())).collect(Collectors.toList()));


        return response;
    }


    @GetMapping("/data")
    public SensorResponseForType getDataForSensorType(@RequestParam String sensorType ,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {

        SensorType type = SensorType.valueOf(sensorType);

        Page<SensorDataEntity> result = service.getSensorDataBySensorType( type, PageRequest.of(page, size));

        SensorResponseForType response = new SensorResponseForType();

        response.setType(type);
        response.setPage(result.getNumber());
        response.setSize(result.getNumberOfElements());
        response.setTotalPages(result.getTotalPages());
        if(result.isEmpty())return null;
        response.setStart(result.getContent().get(0).getTimestamp());
        response.setEnd(result.getContent().get(result.getSize()-1).getTimestamp());

        response.setData(result.stream().map(r -> new SensorTimeSeriesData(r.getTimestamp(), r.getValue())).collect(Collectors.toList()));

        return response;

    }


    @GetMapping("/sensors")
    public List<String> getSensors(){
        return service.getSensorList();
    }



}
