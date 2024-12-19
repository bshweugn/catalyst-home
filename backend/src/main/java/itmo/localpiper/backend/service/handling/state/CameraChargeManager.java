package itmo.localpiper.backend.service.handling.state;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;


public class CameraChargeManager implements Runnable {

    private static final CameraChargeManager INSTANCE = new CameraChargeManager();

    private final Map<Long, CameraChargeState> cameraStates = new ConcurrentHashMap<>();

    private volatile boolean running = true;

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
        Thread thread = new Thread(this);
        thread.setDaemon(true);
        thread.start();
    }

    public void stop() {
        running = false;
    }

    @Override
    public void run() {
        while (running) {
            for (CameraChargeState state : cameraStates.values()) {
                state.update();
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}

