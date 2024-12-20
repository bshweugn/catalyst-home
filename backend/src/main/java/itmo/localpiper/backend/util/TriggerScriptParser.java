package itmo.localpiper.backend.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Service
public class TriggerScriptParser {

    private static final Set<String> VALID_PREDICATES = Set.of(
            "MOTION_DETECTED", "TEMP_LOWER_THAN", "TEMP_EQUALS", "TEMP_GREATER_THAN",
            "HUM_LOWER_THAN", "HUM_EQUALS", "HUM_GREATER_THAN"
    );

    public ParsedTrigger parseTriggerString(String triggerString) {
        if (triggerString == null || triggerString.isBlank()) {
            throw new IllegalArgumentException("Trigger string cannot be null or blank.");
        }

        // Regular expressions for trigger and scripts
        String triggerRegex = "\\[(\\d+),\\s*([A-Z_]+),\\s*(.+?)]";
        String scriptRegex = "\\((\\d+),\\s*([A-Z_]+),\\s*(.+?)\\)";

        // Match the trigger
        Pattern triggerPattern = Pattern.compile(triggerRegex);
        Matcher triggerMatcher = triggerPattern.matcher(triggerString);

        if (!triggerMatcher.find()) {
            throw new IllegalArgumentException("Invalid or missing trigger in trigger string.");
        }

        String triggerRaw = triggerMatcher.group(0); // Store raw string
        int triggerId = Integer.parseInt(triggerMatcher.group(1));
        String predicate = triggerMatcher.group(2);
        String arg = triggerMatcher.group(3);

        // Validate the predicate
        if (!VALID_PREDICATES.contains(predicate)) {
            throw new IllegalArgumentException("Invalid predicate: " + predicate);
        }

        // Try to parse the argument for trigger
        Object triggerArg = parseArgument(arg);

        RawTrigger trigger = new RawTrigger(triggerId, predicate, triggerArg, triggerRaw);

        // Match scripts
        Pattern scriptPattern = Pattern.compile(scriptRegex);
        Matcher scriptMatcher = scriptPattern.matcher(triggerString);

        List<RawScript> scripts = new ArrayList<>();
        while (scriptMatcher.find()) {
            String scriptRaw = scriptMatcher.group(0); // Store raw string
            int scriptId = Integer.parseInt(scriptMatcher.group(1));
            String parameter = scriptMatcher.group(2);
            String scriptArg = scriptMatcher.group(3);

            // Try to parse the argument for script
            Object parsedArg = parseArgument(scriptArg);

            scripts.add(new RawScript(scriptId, parameter, parsedArg, scriptRaw));
        }

        if (scripts.isEmpty()) {
            throw new IllegalArgumentException("No scripts found in trigger string.");
        }

        return new ParsedTrigger(trigger, scripts);
    }

    private Object parseArgument(String arg) {
        arg = arg.trim();
        if (arg.startsWith("\"") && arg.endsWith("\"")) {
            return arg.substring(1, arg.length() - 1); // String argument
        }
        try {
            if (arg.contains(".")) {
                return Double.valueOf(arg); // Double argument
            }
            return Integer.valueOf(arg); // Integer argument
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid argument: " + arg);
        }
    }

    @Data
    @AllArgsConstructor
    public static class ParsedTrigger {
        private RawTrigger trigger;
        private List<RawScript> scripts;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RawTrigger {
        private int id;
        private String predicate;
        private Object arg;
        private String raw; // Store the raw representation

        @Override
        public String toString() {
            return raw; // Use raw representation for reversion
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RawScript {
        private int id;
        private String parameter;
        private Object arg;
        private String raw; // Store the raw representation

        @Override
        public String toString() {
            return raw; // Use raw representation for reversion
        }
    }
}
