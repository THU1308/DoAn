import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { BlogDto } from '../../dto/blog.dto';
import { ImageDto } from '../../dto/image.dto';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent {
  listBlog: BlogDto[] = [];
  //images: ImageDto[] = [];
  isLoading = true;
  constructor(
    private blogService: BlogService,
    private imageService: ImageService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getListBlog();
  }

  getListBlog() {
    this.blogService.getListBlog().subscribe({
      next: (response: any) => {
        debugger;
        this.listBlog = response.data;
        //this.listBlog = this.listBlog.slice(0, 3);
        for (let i = 0; i < this.listBlog.length; i++) {
          this.getImages(this.listBlog[i]);
          //alert(this.listBlog[i].image?.data);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  getImages(blog: BlogDto): void {
    if (this.listBlog) {
      this.imageService.getListImgById(blog.id).subscribe({
        next: (response: any) => {
          debugger;
          // alert(response.data);
          blog.image = response;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
  }
}
