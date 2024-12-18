package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.VideoRecording;

@Repository
public interface VideoRecordingRepository extends CrudRepository<VideoRecording, Long>{
    @Override
    List<VideoRecording> findAll();

    List<VideoRecording> findAllByCamera(Camera camera);
}
