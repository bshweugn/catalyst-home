package itmo.localpiper.backend.controller.usermode;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.service.processing.video.GetRecordingIntervalsService;
import itmo.localpiper.backend.util.RecordingInterval;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/camera")

public class VideoStreamingController {

    @Autowired
    private GetRecordingIntervalsService getRecordingIntervalsService;

    @Autowired
    private RequestTransformer requestTransformer;

    @GetMapping("/getRecordingIntervals")
    public ResponseEntity<Map<Long, List<RecordingInterval>>> getRecordingIntervals(@RequestParam Long houseId, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(getRecordingIntervalsService.getIntervals(
            requestTransformer.transform(houseId, servletRequest)
        ));
    }

    @GetMapping("/stream")
    public ResponseEntity<byte[]> streamVideo(@RequestHeader HttpHeaders headers) throws IOException {
        Path videoDirectory = Paths.get("videos"); // Directory to store video files
        String videoFileName = "video.mp4"; // Hardcoded video file name
        // Construct file path
        Path videoPath = videoDirectory.resolve(videoFileName).normalize();

        // Validate file exists
        if (!videoPath.toFile().exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
                    start = ranges.length > 0 ? Long.parseLong(ranges[0]) : 0;
                    end = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileLength - 1;
                }
            }

            // Validate range
            if (start > end || start < 0 || end >= fileLength) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).build();
            }

            // Read requested range
            videoFile.seek(start);
            int bufferSize = (int) (end - start + 1);
            buffer = new byte[bufferSize];
            videoFile.readFully(buffer);

            // Set response headers
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.add("Content-Type", "video/mp4");
            responseHeaders.add("Accept-Ranges", "bytes");
            responseHeaders.add("Content-Range", "bytes " + start + "-" + end + "/" + fileLength);

            return new ResponseEntity<>(buffer, responseHeaders, HttpStatus.PARTIAL_CONTENT);
        }
    }
}
