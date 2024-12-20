package itmo.localpiper.backend.service.processing.video;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.VideoRecordingRepository;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;
import itmo.localpiper.backend.util.enums.ProcessingStatus;

@Service
public class DeleteVideosService {

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private VideoRecordingRepository videoRecordingRepository;

    @Autowired
    private AccessValidationService accessValidationService;
    
    public OperationResultResponse deleteVideos(RequestPair<Long> request) {
        String email = request.getEmail();
        Long cameraId = request.getBody();

        Camera camera = cameraRepository.findById(cameraId).orElse(null);
        accessValidationService.validateAccess(email, camera.getRoom().getFloor().getHouse().getId(), AccessMode.STRICT);
        
        videoRecordingRepository.deleteAll(videoRecordingRepository.findAllByCamera(camera));
        return new OperationResultResponse(ProcessingStatus.SUCCESS, "All recordings deleted");
    }
}
