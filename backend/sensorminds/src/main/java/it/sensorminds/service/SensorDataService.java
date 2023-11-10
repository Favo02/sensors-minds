package it.sensorminds.service;

import it.sensorminds.SensorDataEntity;
import it.sensorminds.model.SensorDataModel;
import it.sensorminds.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

@Service
public class SensorDataService {

    @Autowired
    private SensorDataRepository sensorDataRepository;

    public Page<SensorDataEntity> getSensorDataBySensorName(String sensorname, Pageable pageable) {
        return sensorDataRepository.findBySensorname(sensorname, pageable);
    }

    public void persistSensorData(SensorDataModel sdm){

        //Round number
        BigDecimal bd = new BigDecimal(Float.toString(sdm.getValue()));
        bd = bd.setScale(2, RoundingMode.HALF_UP);
        sdm.setValue(bd.floatValue());

        //Save data
        SensorDataEntity entity = new SensorDataEntity(null
                , sdm.getSensorName(),
                new Date(),
                sdm.getType(),
                sdm.getValue());

        sensorDataRepository.save(entity);

    }



    // Other methods using repository...
}