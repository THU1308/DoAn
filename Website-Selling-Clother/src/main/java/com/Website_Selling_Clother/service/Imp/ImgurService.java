package com.Website_Selling_Clother.service.Imp;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

@Service
public class ImgurService {

    private final String clientId = "4044cd3d39f43d2";
    private static final String IMGUR_UPLOAD_URL = "https://api.imgur.com/3/upload";
    private final Map<Integer, String> imageCache = new ConcurrentHashMap<>();
    private final Semaphore semaphore = new Semaphore(5); // Giới hạn 5 yêu cầu đồng thời

    public CompletableFuture<String> uploadImageAsync(byte[] imageBytes) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                semaphore.acquire();
                return uploadImage(imageBytes);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return null;
            } finally {
                semaphore.release();
            }
        });
    }

    public String uploadImage(byte[] imageBytes) {
        try {
            int hash = java.util.Arrays.hashCode(imageBytes);
            if (imageCache.containsKey(hash)) {
                return imageCache.get(hash);
            }

            // Chỉ nén nếu ảnh lớn hơn 500x500
            byte[] compressedImageBytes = compressImage(imageBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Client-ID " + clientId);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String base64Image = Base64.getEncoder().encodeToString(compressedImageBytes);
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("image", base64Image);

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(IMGUR_UPLOAD_URL, entity, String.class);

            String responseBody = response.getBody();
            String imageUrl = extractImageUrl(responseBody);
            if (imageUrl != null) {
                imageCache.put(hash, imageUrl);
            }
            return imageUrl;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private byte[] compressImage(byte[] imageBytes) {
        try {
            ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
            BufferedImage originalImage = ImageIO.read(inputStream);
            if (originalImage.getWidth() <= 500 && originalImage.getHeight() <= 500) {
                return imageBytes; // Không nén nếu ảnh đã nhỏ
            }
            BufferedImage resizedImage = resizeImage(originalImage, 100, 100);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "jpg", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return imageBytes;
        }
    }

    private String extractImageUrl(String responseBody) {
        int start = responseBody.indexOf("\"link\":\"") + 8;
        int end = responseBody.indexOf("\"}", start);
        return responseBody.substring(start, end);
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        Image tmp = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.drawImage(tmp, 0, 0, null);
        g2d.dispose();
        return resized;
    }
}

