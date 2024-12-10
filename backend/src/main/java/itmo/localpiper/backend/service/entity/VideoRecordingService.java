package itmo.localpiper.backend.service.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.VideoRecording;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.VideoRecordingRepository;

@Service
public class VideoRecordingService {
    
    @Autowired
    private VideoRecordingRepository videoRecordingRepository;

    @Autowired
    private CameraRepository cameraRepository;

    public List<VideoRecording> read() {
        return videoRecordingRepository.findAll();
    }

    public void create(Long cameraId, LocalDateTime time, String source) {
        VideoRecording videoRecording = new VideoRecording();
        Camera camera = cameraRepository.findById(cameraId).get();
        videoRecording.setCamera(camera);
        videoRecording.setTime(time);
        videoRecording.setSource(source);
        
        videoRecordingRepository.save(videoRecording);
    }

    public void delete(Long id) {
        videoRecordingRepository.deleteById(id);
    }
}
