package itmo.localpiper.backend.service.handling.state;

import java.time.ZonedDateTime;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;

public class CameraChargeState {

    private final Camera camera;
    private final CameraRepository repository;
    private final VideoRecordingService service;
    private final RecordingStateManager recordingStateManager = RecordingStateManager.getInstance();
    private boolean charging;

    public CameraChargeState(Camera camera, CameraRepository repository, VideoRecordingService service) {
        this.camera = camera;
        this.repository = repository;
        this.service = service;
        this.charging = Boolean.TRUE.equals(camera.getCharging());
    }

    public synchronized void setCharging(boolean charging) {
        this.charging = charging;
        camera.setCharging(charging);
        persistState();
    }

    public synchronized void setRecording(boolean recording) {
        camera.setIsRecording(recording);
        persistState();
    }

    public synchronized void update() {
        int batteryLevel = camera.getBatteryLevel();

        if (charging) {
            batteryLevel = Math.min(batteryLevel + 2, 100);
        } else {
            int depletionRate = camera.getIsRecording() ? 5 : 1;
            batteryLevel = Math.max(batteryLevel - depletionRate, 0);

            if (batteryLevel == 0) {
                stopRecordingDueToBattery();
                camera.setStatus("OFF");
            } else if (batteryLevel < 10 && camera.getIsRecording()) {
                stopRecordingDueToBattery();
            }
        }
        camera.setBatteryLevel(batteryLevel);
        persistState();
    }

    private void stopRecordingDueToBattery() {
        if (camera.getIsRecording()) {
            setRecording(false);
            if (recordingStateManager.isRecording(camera.getId())) {
                ZonedDateTime startTime = recordingStateManager.getRecordingStartTime(camera.getId());
                service.create(camera.getId(), startTime, ZonedDateTime.now());
                recordingStateManager.stopRecording(camera.getId());
            }
        }
    }

    private void persistState() {
        repository.save(camera);
    }
}


