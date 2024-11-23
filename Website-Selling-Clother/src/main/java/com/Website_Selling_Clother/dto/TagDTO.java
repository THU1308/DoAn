package com.Website_Selling_Clother.dto;
import com.Website_Selling_Clother.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagDTO {
    private String name;
    public static TagDTO fromTag(Tag tag){
        TagDTO tagDTO = new TagDTO();
        tagDTO.setName(tagDTO.getName());
        return tagDTO;
    }
}
