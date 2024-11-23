package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.TagDTO;
import com.Website_Selling_Clother.entity.Tag;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.TagRepository;
import com.Website_Selling_Clother.service.ITagService;
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
