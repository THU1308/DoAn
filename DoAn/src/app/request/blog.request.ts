export interface BlogRequest {
    title: string;
    description: string; 
    content: string; 
    imageId: number; 
    tags:string| number[]; 
    username: string; 
  }
  