import { Component } from '@angular/core';
import { BlogService } from '../services/blog/blog.service';
import { BlogRequest } from '../request/blog.request';
import { UserService } from '../services/user/user.service';
import { TokenService } from '../services/token.service';
import { TagService } from '../services/tag.service';
import { ImageService } from '../services/image/image.service';
import { ImageDto } from '../dto/image.dto';
import { TagDto } from '../dto/tag.dto';

@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.scss']
})
export class AdminBlogComponent {
  listBlog: any[] = [];
  blogForm: BlogRequest = {
    title: '',
    description: '',
    content: '',
    imageId: 0,
    tags: [],
    username: ''
  };
  blogTagsInput: string = '';
  displayForm: boolean = false;
  deleteForm: boolean = false;
  onUpdate: boolean = false;
  currentBlogId: number | null = null;
  currentUserName: any

  showNotification: boolean = false;
  isLoading: boolean = false;
  message: string = '';

  availableImages: ImageDto[] = [];
  availableTags: TagDto[] = [];
  selectedImage: any = null;

  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private tokenService: TokenService,
    private tagService: TagService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.getListBlog();
    this.getCurrentUser();
    this.loadBlogImages();
    this.loadTags();
  }

  timeoutNotification(milliseconds: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milliseconds);
  }

  notification(message: string) {
    this.showNotification = true;
    this.message = message;
    this.timeoutNotification(2000);
  }

  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        this.currentUserName = res.data.username;
      },
      error: (err) => console.error(err),
    });
  }

  selectImage(image: any) {
    //debugger
    this.selectedImage = image;
    this.blogForm.imageId = image.id;
    console.log(this.blogForm.imageId)
  }

  loadBlogImages() {
    this.imageService.getListImages().subscribe({
      next: (res: any) => {
        this.availableImages = res;
      },
      error: (err) => console.error(err),
    });
  }

  loadTags() {
    this.tagService.getListTag().subscribe({
      next: (res: any) => {
        this.availableTags = res.data;
      },
      error: (err) => console.error(err),
    });
  }

  getListBlog(): void {
    this.blogService.getListBlog().subscribe({
      next: (data: any) => {
        this.listBlog = data.data;
      },
      error: (err: any) => console.error('Error:', err),
    });
  }

  showForm(): void {
    this.blogForm = {
      title: '',
      description: '',
      content: '',
      imageId: 0,
      tags: [],
      username: ''
    };
    this.blogTagsInput = '';
    this.displayForm = true;
    this.onUpdate = false;
  }

  closeForm(): void {
    this.displayForm = false;
  }

  createBlog(): void {
   
    if (!Array.isArray(this.blogForm.tags)) {
      this.blogForm.tags = [];
    }
    this.blogForm.username = this.currentUserName;
    this.blogService.createBlog(this.blogForm).subscribe({
      next: (res: any) => {
        if (res.message === 'Success') {
          this.closeForm();
          this.notification('Blog created successfully!');
          this.getListBlog();
        } else {
          this.notification('Error when creating blog!');
        }
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.notification('Error creating blog');
      },
    });
  }

  onUpdateForm(id: number): void {
    
    this.currentBlogId = id;
    this.onUpdate = true;
    this.blogService.getBlogById(id).subscribe({
      next: (data: any) => {
        this.blogForm = { ...data.data };
        this.imageService.getListImgById(data.data.imageId).subscribe({
          next: (res: any) => {
            this.selectedImage = res;
          },
          error: (err) => console.error(err),
        });
        this.displayForm = true;
      },
      error: (err: any) => console.error('Error:', err),
    });
  }

  updateBlog(): void {
   
    if (!this.currentBlogId) {
      console.error('Không tìm thấy ID blog để cập nhật.');
      return;
    }
    this.blogForm.username = this.currentUserName;
    if (typeof this.blogForm.tags === 'string') {
      // Nếu tags là chuỗi, ta tách chuỗi thành mảng và chuyển từng phần tử thành số
      this.blogForm.tags = this.blogForm.tags.split(',').map(tag => Number(tag.trim()));
    }
    console.log(this.blogForm)
    this.blogService.updateBlog(this.currentBlogId, this.blogForm).subscribe({
      next: (res: any) => {
        debugger
        if (res.message === 'Success') {
          this.closeForm();
          this.notification('Cập nhật blog thành công!');
          this.getListBlog();
        } else {
          this.notification('Có lỗi xảy ra trong quá trình cập nhật.');
        }
      },
      error: (err: any) => {
        console.error('Lỗi cập nhật blog:', err);
        this.notification('Lỗi khi cập nhật blog.');
      },
    });
  }



  onDelete(id: number): void {
    this.currentBlogId = id;
    this.deleteForm = true;
  }

  deleteBlog(): void {
    this.blogService.deleteBlog(this.currentBlogId!).subscribe({
      next: () => {
        this.getListBlog();
        this.deleteForm = false;
        this.notification('Blog deleted successfully!');
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.notification('Error deleting blog');
      },
    });
  }
}
