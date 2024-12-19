package itmo.localpiper.backend.service.processing.video;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import itmo.localpiper.backend.dto.request.VideoStreamingRequest;
import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.VideoRecording;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.util.AccessValidationService;
import itmo.localpiper.backend.util.RequestPair;
import itmo.localpiper.backend.util.enums.AccessMode;

@Service
public class VideoStreamingService {

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private AccessValidationService accessValidationService;

    private VideoRecording findByTimestamp(List<VideoRecording> videos, ZonedDateTime timestamp) {
        if (videos == null || videos.isEmpty()) {
            return null;
        }
        videos.sort(Comparator.comparing(VideoRecording::getFrom));
        
        int low = 0, high = videos.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            VideoRecording midVideo = videos.get(mid);
            
            if (!timestamp.isBefore(midVideo.getFrom()) && !timestamp.isAfter(midVideo.getTo())) {
                return midVideo;
            } else if (timestamp.isBefore(midVideo.getFrom())) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return null;
    }

    private byte[] stream(String source, HttpHeaders headers) throws IOException {
        Path videoPath = Paths.get("videos/" + source).normalize();

        // Validate that the file exists
        if (!videoPath.toFile().exists()) {
            throw new FileNotFoundException("Video file not found: " + source);
        }

        try (RandomAccessFile videoFile = new RandomAccessFile(videoPath.toFile(), "r")) {
            long fileLength = videoFile.length();
            byte[] buffer;
            long start = 0, end = fileLength - 1;

            // Parse `Range` header if present
            if (headers.containsKey(HttpHeaders.RANGE)) {
                String rangeHeader = headers.getFirst(HttpHeaders.RANGE);
                if (StringUtils.hasText(rangeHeader) && rangeHeader.startsWith("bytes=")) {
                    String[] ranges = rangeHeader.replace("bytes=", "").split("-");
                    start = ranges.length > 0 && !ranges[0].isEmpty() ? Long.parseLong(ranges[0]) : 0;
                    end = ranges.length > 1 && !ranges[1].isEmpty() ? Long.parseLong(ranges[1]) : fileLength - 1;
                }
            }

            // Validate range
            if (start > end || start < 0 || end >= fileLength) {
                throw new IllegalArgumentException("Invalid Range: bytes=" + start + "-" + end);
            }

            // Read requested range
            videoFile.seek(start);
            int bufferSize = (int) (end - start + 1);
            buffer = new byte[bufferSize];
            videoFile.readFully(buffer);

            return buffer;
        }
    }

    public byte[] process(RequestPair<VideoStreamingRequest> request, HttpHeaders headers) throws IOException {
        String email = request.getEmail();
        Long cameraId = request.getBody().getCameraId();
        ZonedDateTime timestamp = request.getBody().getTimestamp();
        
        Camera camera = cameraRepository.findById(cameraId).get();
        accessValidationService.validateAccess(email, camera.getRoom().getFloor().getHouse().getId(), AccessMode.LIGHT);

        List<VideoRecording> videos = camera.getVideoRecordings();
        VideoRecording video = findByTimestamp(videos, timestamp);
        if (video == null) return null;
        return stream(video.getSource(), headers);
    }
}
