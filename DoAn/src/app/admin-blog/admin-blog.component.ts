import { Component } from '@angular/core';
import { BlogService } from '../services/blog/blog.service';

@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.scss']
})
export class AdminBlogComponent {
  listBlog: any[] = [];
  blogForm: any = {};
  blogTagsInput: string = '';
  displayForm: boolean = false;
  deleteForm: boolean = false;
  onUpdate: boolean = false;
  currentBlogId: number | null = null;

  showNotification: boolean = false;
  isLoading: boolean = false;
  message: string = '';

  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  notification(message: string) {
    this.showNotification = true;
    this.message = message; 
    this.timeoutNotification(2000);
  }

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getListBlog();
  }

  // Lấy danh sách blog
  getListBlog(): void {
    this.blogService.getListBlog().subscribe({
      next: (data : any) => (this.listBlog = data.data),
      error: (err : any) => console.error('Error:', err),
    });
  }

  // Hiển thị form thêm/sửa blog
  showForm(): void {
    this.blogForm = {};
    this.blogTagsInput = '';
    this.displayForm = true;
    this.onUpdate = false;
  }

  // Đóng form
  closeForm(): void {
    this.displayForm = false;
  }

  // Thêm blog mới
  createBlog(): void {
    this.blogForm.tags = this.blogTagsInput.split(',').map(Number);
    this.blogService.createBlog(this.blogForm).subscribe({
      next: () => {
        this.getListBlog();
        this.closeForm();
      },
      error: (err : any) => console.error('Error:', err),
    });
  }

  // Hiển thị form cập nhật blog
  onUpdateForm(id: number): void {
    this.currentBlogId = id;
    this.onUpdate = true;
    this.blogService.getBlogById(id).subscribe({
      next: (data : any) => {
        this.blogForm = { ...data.data };
        this.blogTagsInput = this.blogForm.tags.join(',');
        this.displayForm = true;
      },
      error: (err : any) => console.error('Error:', err),
    });
  }

  // Cập nhật blog
  updateBlog(): void {
    this.blogForm.tags = this.blogTagsInput.split(',').map(Number);
    this.blogService.updateBlog(this.currentBlogId!, this.blogForm).subscribe({
      next: () => {
        this.getListBlog();
        this.closeForm();
      },
      error: (err : any) => console.error('Error:', err),
    });
  }

  // Hiển thị xác nhận xóa
  onDelete(id: number): void {
    this.currentBlogId = id;
    this.deleteForm = true;
  }

  // Xóa blog
  deleteBlog(): void {
    this.blogService.deleteBlog(this.currentBlogId!).subscribe({
      next: () => {
        this.getListBlog();
        this.deleteForm = false;
      },
      error: (err : any) => console.error('Error:', err),
    });
  }

  // Cập nhật danh sách tags
  updateTags(): void {
    this.blogTagsInput = this.blogTagsInput.replace(/\s+/g, '');
  }
}
