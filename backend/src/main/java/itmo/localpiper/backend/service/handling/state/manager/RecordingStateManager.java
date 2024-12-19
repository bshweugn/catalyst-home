package itmo.localpiper.backend.service.handling.state.manager;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RecordingStateManager {

    private static final RecordingStateManager INSTANCE = new RecordingStateManager();

    private final Map<Long, ZonedDateTime> recordingStartTimes = new ConcurrentHashMap<>();

    private RecordingStateManager() {}

    public static RecordingStateManager getInstance() {
        return INSTANCE;
    }

    public ZonedDateTime getRecordingStartTime(Long cameraId) {
        return recordingStartTimes.get(cameraId);
    }

    public void startRecording(Long cameraId) {
        recordingStartTimes.put(cameraId, ZonedDateTime.now());
    }

    public ZonedDateTime stopRecording(Long cameraId) {
        return recordingStartTimes.remove(cameraId);
    }

    public boolean isRecording(Long cameraId) {
        return recordingStartTimes.containsKey(cameraId);
    }
}

