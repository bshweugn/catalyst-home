package itmo.localpiper.backend.service.processing.video;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.VideoRecording;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.repository.VideoRecordingRepository;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RecordingInterval;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;


@Service
public class GetRecordingIntervalsService {

    @Autowired
    private AccessValidationService accessValidationService;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private VideoRecordingRepository videoRecordingRepository;
    
    public Map<Long, List<RecordingInterval>> getIntervals(RequestPair<Long> rp) {
        String email = rp.getEmail();
        Long houseId = rp.getBody();
        accessValidationService.validateAccess(email, houseId, AccessMode.LIGHT);
        List<Camera> cameras = cameraRepository.findAllByHouseId(houseId);
        Map<Long, List<RecordingInterval>> mp = new HashMap<>();
        for (Camera camera : cameras) {
            List<VideoRecording> vrs = videoRecordingRepository.findAllByCamera(camera);
            List<RecordingInterval> ri = new ArrayList<>();
            for (VideoRecording vr : vrs) ri.add(new RecordingInterval(vr.getFrom(), vr.getTo()));
            mp.put(camera.getId(), ri);
        }
        return mp;
    }
}
