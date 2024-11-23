import { ImageDto } from "./image.dto";

export interface BlogDto {
    id: number;
    title: string;
    description: string;
    content: string;
    createAt: string;
    imageId: number;
    username: string;
    tags: number[];
    image?:ImageDto;
  }  