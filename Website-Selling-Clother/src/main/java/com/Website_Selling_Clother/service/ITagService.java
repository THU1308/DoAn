package com.example.shopclothes.service.Imp;

import com.example.shopclothes.dto.TagDTO;
import com.example.shopclothes.entity.Tag;
import com.example.shopclothes.exception.DataNotFoundException;

import java.util.List;

public interface ITagService {
    List<Tag> getListTag();

    Tag createTag(TagDTO tagDTO);

    Tag updateTag(int id,TagDTO tagDTO) throws DataNotFoundException;

    void enableTag(int id) throws DataNotFoundException;

    void deleleTag(int id) throws DataNotFoundException;
}
