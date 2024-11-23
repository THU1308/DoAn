package com.Website_Selling_Clother.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name= "image")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="name")
    private String name;

    @Column(name="type")
    private String type;

    @Column(name="size")
    private long size;

    @Lob
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public static List<Image> sortImagesDescending(List<Image> listImage) {
        // Sử dụng phương thức sort() của Collections và cung cấp một Comparator
        Collections.sort(listImage, new Comparator<Image>() {
            @Override
            public int compare(Image img1, Image img2) {
                // So sánh ID của hai hình ảnh và trả về kết quả ngược lại
                return Long.compare(img2.getId(), img1.getId());
            }
        });
        return listImage;
    }
}
