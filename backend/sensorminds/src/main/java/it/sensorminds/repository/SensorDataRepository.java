package it.sensorminds.repository;

import it.sensorminds.SensorDataEntity;
import it.sensorminds.enumerator.SensorType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SensorDataRepository extends MongoRepository<SensorDataEntity, String> {

    // Find sensor data by sensor name with pagination
    Page<SensorDataEntity> findBySensorname(String sensorname, Pageable pageable);

    // Find sensor data by type with pagination
    Page<SensorDataEntity> findByType(SensorType type, Pageable pageable);

    // Find sensor data within a specific time range with pagination
    Page<SensorDataEntity> findByTimestampBetween(Date start, Date end, Pageable pageable);

    // Additional custom queries can be added as needed
}
