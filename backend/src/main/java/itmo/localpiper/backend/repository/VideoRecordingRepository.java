package itmo.localpiper.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.VideoRecording;

@Repository
public interface VideoRecordingRepository extends CrudRepository<Long, VideoRecording>{
    
}
