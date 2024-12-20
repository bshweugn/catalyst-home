package itmo.localpiper.backend.controller.usermode;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import itmo.localpiper.backend.dto.request.VideoStreamingRequest;
import itmo.localpiper.backend.dto.response.OperationResultResponse;
import itmo.localpiper.backend.service.processing.video.DeleteVideosService;
import itmo.localpiper.backend.service.processing.video.GetRecordingIntervalsService;
import itmo.localpiper.backend.service.processing.video.VideoStreamingService;
import itmo.localpiper.backend.util.RecordingInterval;
import itmo.localpiper.backend.util.RequestTransformer;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/camera")

public class VideoStreamingController {

    @Autowired
    private GetRecordingIntervalsService getRecordingIntervalsService;

    @Autowired
    private VideoStreamingService videoStreamingService;

    @Autowired
    private DeleteVideosService deleteVideosService;

    @Autowired
    private RequestTransformer requestTransformer;

    @PostMapping("/deleteRecordings")
    public ResponseEntity<OperationResultResponse> deleteCameraRecordings(@RequestBody Long cameraId, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(deleteVideosService.deleteVideos(requestTransformer.transform(cameraId, servletRequest)));
    }
    

    @GetMapping("/getRecordingIntervals")
    public ResponseEntity<Map<Long, List<RecordingInterval>>> getRecordingIntervals(@RequestParam Long houseId, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(getRecordingIntervalsService.getIntervals(
            requestTransformer.transform(houseId, servletRequest)
        ));
    }

    @PostMapping("/stream")
    public ResponseEntity<byte[]> stream(
        @RequestBody VideoStreamingRequest request,
        @RequestHeader HttpHeaders headers, 
        HttpServletRequest servletRequest) {
        try {
            byte[] videoData = videoStreamingService.process(requestTransformer.transform(request, servletRequest), headers);

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.add("Content-Type", "video/mp4");
            responseHeaders.add("Accept-Ranges", "bytes");

            String rangeHeader = headers.getFirst(HttpHeaders.RANGE);
            if (rangeHeader != null && videoData.length > 0) {
                long fileSize = videoData.length;
                String contentRange = "bytes " + rangeHeader + "/" + fileSize;
                responseHeaders.add("Content-Range", contentRange);
                return new ResponseEntity<>(videoData, responseHeaders, HttpStatus.PARTIAL_CONTENT);
            }

            return new ResponseEntity<>(videoData, responseHeaders, HttpStatus.OK);
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
