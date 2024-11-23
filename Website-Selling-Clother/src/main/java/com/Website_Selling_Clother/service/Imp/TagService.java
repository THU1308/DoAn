package com.example.shopclothes.service;

import com.example.shopclothes.dto.TagDTO;
import com.example.shopclothes.entity.Tag;
import com.example.shopclothes.exception.DataNotFoundException;
import com.example.shopclothes.repository.TagRepository;
import com.example.shopclothes.service.Imp.ITagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService implements ITagService {

    @Autowired
    TagRepository tagRepository;


    @Override
    public List<Tag> getListTag() {
        return tagRepository.findAll();
    }

    @Override
    public Tag createTag(TagDTO tagDTO) {
        Tag tag = new Tag();
        tag.setName(tagDTO.getName());
        tagRepository.save(tag);
        return tag;
    }

    @Override
    public Tag updateTag(int id, TagDTO tagDTO) throws DataNotFoundException {
        Tag tag = tagRepository.findById(id).orElseThrow(()-> new DataNotFoundException("Không tìm thấy tag với id: " + id));
        tag.setName(tagDTO.getName());
        tagRepository.save(tag);
        return tag;
    }

    @Override
    public void enableTag(int id) throws DataNotFoundException {
        Tag tag = tagRepository.findById(id).orElseThrow(()-> new DataNotFoundException("Không tìm thấy tag với id: " + id));
        if (tag.isEnable()){
           tag.setEnable(false);
        }
        else {
            tag.setEnable(true);
        }
        tagRepository.save(tag);
    }

    @Override
    public void deleleTag(int id) throws DataNotFoundException {
        Tag tag = tagRepository.findById(id).orElseThrow(()-> new DataNotFoundException("Không tìm thấy tag với id: " + id));
        tagRepository.delete(tag);
    }
}
