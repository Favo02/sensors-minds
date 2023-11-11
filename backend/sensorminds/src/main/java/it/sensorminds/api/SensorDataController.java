package it.sensorminds.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.sensorminds.SensorDataEntity;
import it.sensorminds.model.*;
import it.sensorminds.service.SensorDataService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
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
        response.setEnd(result.getContent().get(result.getNumberOfElements()-1).getTimestamp());

        response.setData(result.stream().map(r -> new SensorTimeSeriesData(r.getTimestamp(), r.getValue())).collect(Collectors.toList()));


        return response;
    }


    @GetMapping("/data")
    public SensorResponseForType getDataForSensorType(@RequestParam String sensorType ,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {

        String type = sensorType;

        Page<SensorDataEntity> result = service.getSensorDataBySensorType( type, PageRequest.of(page, size));

        SensorResponseForType response = new SensorResponseForType();

        response.setType(type);
        response.setPage(result.getNumber());
        response.setSize(result.getNumberOfElements());
        response.setTotalPages(result.getTotalPages());
        if(result.isEmpty())return null;
        response.setStart(result.getContent().get(0).getTimestamp());
        response.setEnd(result.getContent().get(result.getNumberOfElements()-1).getTimestamp());

        response.setData(result.stream().map(r -> new SensorTimeSeriesData(r.getTimestamp(), r.getValue())).collect(Collectors.toList()));

        return response;

    }


    @GetMapping("/sensors")
    public List<String> getSensors(){
        return service.getSensorList();
    }


    @GetMapping("/types")
    public List<String> getTypes(){
        return service.getTypes();
    }

    @PostMapping("/upload")
    public void handleFileUpload(@RequestParam("file") MultipartFile file,
                                   @RequestBody() UploadBody body) throws IOException {

        List<SensorDataModel> sensorDataModels = parseCsvFile(file);
        sensorDataModels.forEach(sensorDataModel -> service.persistSensorData(sensorDataModel));
    }

    public List<SensorDataModel> parseCsvFile(MultipartFile file) throws IOException {
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)) {
            CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreHeaderCase()
                    .withTrim());

            List<SensorDataModel> records = new ArrayList<>();
            for (CSVRecord csvRecord : parser) {
                SensorDataModel record = new SensorDataModel(csvRecord.get("sensorname"), Float.parseFloat(csvRecord.get("value")),csvRecord.get("type") );

                records.add(record);
            }
            return records;
        }
    }

}
