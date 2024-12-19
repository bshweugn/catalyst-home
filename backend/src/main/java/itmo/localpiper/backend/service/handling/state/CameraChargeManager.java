package itmo.localpiper.backend.service.handling.state;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;


public class CameraChargeManager {

    private static final CameraChargeManager INSTANCE = new CameraChargeManager();

    private final Map<Long, CameraChargeState> cameraStates = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private CameraChargeManager() {}

    public static CameraChargeManager getInstance() {
        return INSTANCE;
    }

    public void registerCamera(Camera camera, CameraRepository cameraRepository, VideoRecordingService videoRecordingService) {
        cameraStates.put(camera.getId(), new CameraChargeState(camera, cameraRepository, videoRecordingService));
    }

    public void deregisterCamera(Long cameraId) {
        cameraStates.remove(cameraId);
    }

    public CameraChargeState getCameraState(Long cameraId) {
        return cameraStates.get(cameraId);
    }

    public void start() {
        scheduler.scheduleAtFixedRate(() -> {
            for (CameraChargeState state : cameraStates.values()) {
                state.update();
            }
        }, 0, 3, TimeUnit.SECONDS);
    }

    public void stop() {
        scheduler.shutdownNow();
    }
}

