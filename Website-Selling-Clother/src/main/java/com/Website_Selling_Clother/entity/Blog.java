package com.Website_Selling_Clother.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="blog")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "description",columnDefinition = "TEXT")
    private String description;


    @Column(name = "content",columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private Date createAt;

    @ManyToOne
    @JoinColumn(name="image_id")
    private Image image;


    @ManyToOne
    @JoinColumn(name= "user_id")
    private User user;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name="blog_tag",joinColumns = @JoinColumn(name="blog_id"),inverseJoinColumns = @JoinColumn(name="tag_id"))
    private Set<Tag> tags = new HashSet<>();
}
