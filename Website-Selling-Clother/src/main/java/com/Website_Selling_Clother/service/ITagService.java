package com.Website_Selling_Clother.service;



import com.Website_Selling_Clother.dto.TagDTO;
import com.Website_Selling_Clother.entity.Tag;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;

public interface ITagService {
    List<Tag> getListTag();

    Tag createTag(TagDTO tagDTO);

    Tag updateTag(int id,TagDTO tagDTO) throws DataNotFoundException;

    void enableTag(int id) throws DataNotFoundException;

    void deleleTag(int id) throws DataNotFoundException;
}
