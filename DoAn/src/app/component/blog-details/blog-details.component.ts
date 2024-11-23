import { Component } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { BlogDto } from 'src/app/dto/blog.dto';
import { ImageService } from 'src/app/services/image/image.service';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent {
    constructor(private blogService : BlogService,
      private route: ActivatedRoute,
      private imageService: ImageService){}
    blogDetail : BlogDto | null = null;

    ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        debugger;
        const blogId = +params.get('id')!;
        this.blogService.getBlogById(blogId).subscribe(
          (response: any) => {
            debugger;
            this.blogDetail = response.data;
            if(this.blogDetail != null){
              this.getImages(this.blogDetail)
            }
            console.log(this.blogDetail)
          },
          (error: any) => {
            console.log(error);
          },
        );
      });
    }

    getImages(blog : BlogDto): void {
      if (this.blogDetail) {
        this.imageService.getListImgById(blog.id).subscribe({
          next: (response: any) => {
            debugger;
            // alert(response.data);
            blog.image = response;
            //alert(response.data)
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    }
}
