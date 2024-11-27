package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.exception.BadRequestException;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.service.Imp.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("${api.prefix}/image")
public class ImageController {

    private static String UPLOAD_DIR  = System.getProperty("user.dir") + "/src/main/resources/static/Uploads/";

    @Autowired
    ImageService imageService;

    @GetMapping("/sort")
    public ResponseData<List<Image>> getList(){
        List<Image> listImage = Image.sortImagesDescending(imageService.getListImage());

        return new ResponseData<>(HttpStatus.OK,"Success",listImage.subList(1,2));
    }

    @GetMapping("")
    public ResponseEntity<?> getListSort(){
        List<Image> listImage = imageService.getListImage();

        return  ResponseEntity.ok(listImage.subList(1,5));
    }

//    @GetMapping("/{productId}/{imageId}")
//    public ResponseData<List<Image>> getListByUser(@PathVariable int imageId){
//        List<Image> listImage = imageService.getListByProductId(imageId);
//
//        return new ResponseData<>(HttpStatus.OK,"Success",listImage);
//    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getImageByID(@PathVariable int id){
        try {
            Image image = imageService.getImageById(id);
            // Đóng gói thông tin của hình ảnh vào JSON
            Map<String, Object> response = new HashMap<>();
            response.put("id", image.getId());
            response.put("name", image.getName());
            response.put("data", Base64.getEncoder().encodeToString(image.getData()));

            return ResponseEntity.ok().body(response);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseData<List<Image>> uploadFiles(@RequestParam("files") MultipartFile[] files) throws BadRequestException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        List<Image> uploadedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

            if (originalFilename != null && originalFilename.length() > 0) {
                // Kiểm tra định dạng file
                if (!extension.equals("png") && !extension.equals("jpg") && !extension.equals("gif") && !extension.equals("svg") && !extension.equals("jpeg")) {
                    throw new BadRequestException("Không hỗ trợ định dạng file này");
                }

                try {
                    Image img = new Image();
                    img.setName(file.getOriginalFilename());
                    img.setSize(file.getSize());
                    img.setType(extension);
                    img.setData(file.getBytes());

                    // Lưu ảnh vào thư mục
                    String uid = UUID.randomUUID().toString();
                    String link = UPLOAD_DIR + uid + "." + extension;
                    File serverFile = new File(link);
                    BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                    stream.write(file.getBytes());
                    stream.close();

                    // Lưu ảnh vào database
                    imageService.insertImage(img);
                    uploadedImages.add(img);
                } catch (Exception e) {
                    throw new BadRequestException("Lỗi khi upload file: " + file.getOriginalFilename());
                }
            } else {
                throw new BadRequestException("File không hợp lệ");
            }
        }

        return new ResponseData<>(HttpStatus.OK,"Success",uploadedImages);  // Trả về danh sách các ảnh đã tải lên
    }

}
