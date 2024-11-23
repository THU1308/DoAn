import { Component } from '@angular/core';
import { CategoryService } from '../services/category/category.service';
import { CategoryDto } from '../dto/category.dto';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category-admin.component.html',
  styleUrls: ['./category-admin.component.scss'],
})
export class CategoryAdminComponent {
  listCategory: CategoryDto[] = [];
  categoryForm: any = { id: null, name: null };
  modalType: string | null = null; // 'create', 'update', 'delete'
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

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getListCategory();
  }

  // Lấy danh sách danh mục
  getListCategory() {
    this.categoryService.getListCategory().subscribe({
      next: (res) => {
        this.listCategory = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Hiển thị modal
  showModal(type: string, category?: any) {
    this.modalType = type;
    this.categoryForm = category ? { ...category } : { id: null, name: null };
  }

  // Đóng modal
  closeModal() {
    this.modalType = null;
  }

  // Thêm danh mục
  createCategory() {
    this.categoryService.createCategory({ name: this.categoryForm.name }).subscribe({
      next: () => {
        this.getListCategory();
        this.notification("Thêm danh mục thành công!")
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notification("Đã xảy ra lỗi khi thêm danh mục.")
      },
    });
  }

  // Cập nhật danh mục
  updateCategory() {
    this.categoryService.updateCategory(this.categoryForm.id, { name: this.categoryForm.name }).subscribe({
      next: () => {
        this.getListCategory();
        this.notification("Cập nhật danh mục thành công!")
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notification("Đã xảy ra lỗi khi cập nhật danh mục.")
      },
    });
  }

  // Xóa danh mục
  deleteCategory() {
    this.categoryService.deleteCategory(this.categoryForm.id).subscribe({
      next: (response: any) => {
        debugger
        this.getListCategory();
        this.notification("Xóa danh mục thành công!")
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notification("Đã xảy ra lỗi khi xóa danh mục.")
      },
    });
  }
}
