
export class CategoryDto { 
  id: number;
  name: string;
  enable: boolean;
  constructor(id: number, name: string, enable: boolean) {
    this.id = id;
    this.name = name;
    this.enable = enable;
  }
}

