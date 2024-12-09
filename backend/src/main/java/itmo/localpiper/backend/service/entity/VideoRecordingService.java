package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.repository.VideoRecordingRepository;

@Service
public class VideoRecordingService {
    
    @Autowired
    private VideoRecordingRepository videoRecordingRepository;

    public void delete(Long id) {
        videoRecordingRepository.deleteById(id);
    }
}
