package com.example.roadmap.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class SkillService {

    /**
     * Searches for a file in the classpath under:
     * skill/{name}/content/*@{id}
     *
     * The '*' in the file name represents an unknown (or random) text prefix.
     * For example, if the actual file name is "abc123@XYZ", then for name="alpha" and id="XYZ",
     * the pattern "classpath:skill/alpha/content/*@XYZ" will match it.
     *
     * @param name the skill name (directory name)
     * @param id   the id used as a suffix in the file name (as a String)
     * @return an Optional containing the file content if found, or empty otherwise.
     */
    public Optional<String> loadSkillFile(String name, String id) {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            // Adjust the pattern below if your files have extensions (e.g., "*.json").
            String pattern = "classpath:roadmap/" + name + "/content/*@" + id+".md";
            Resource[] resources = resolver.getResources(pattern);
            if (resources != null && resources.length > 0) {
                // Return the first matching file's content
                Resource resource = resources[0];
                String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                return Optional.of(content);
            } else {
                return Optional.empty();
            }
        } catch (IOException e) {
            // Optionally log the exception
            return Optional.empty();
        }
    }
}
