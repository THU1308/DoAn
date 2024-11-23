import { Component } from '@angular/core';
import { BannerService } from '../services/banner/banner.service';

@Component({
  selector: 'app-admin-banner',
  templateUrl: './admin-banner.component.html',
  styleUrls: ['./admin-banner.component.scss']
})
export class AdminBannerComponent {
  listBanner: any[] = [];
  displayForm: boolean = false;
  deleteForm: boolean = false;
  onUpdate: boolean = false;
  bannerIdToDelete: number | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

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

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.getListBanner();
  }

  getListBanner() {
    this.bannerService.getListBanner().subscribe({
      next: (res) => {
        this.listBanner = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  showForm() {
    this.displayForm = true;
    this.onUpdate = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  closeForm() {
    this.displayForm = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  createBanner() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.bannerService.createBanner(formData).subscribe({
      next: () => {
        this.getListBanner();
        this.closeForm();
        this.showNotification = true;
        this.message = 'Thêm banner thành công!';
        this.timeoutNotification(2000);
      },
      error: (err:any) => {
        console.error(err);
        this.showNotification = true;
        this.message = 'Thêm banner thất bại!';
        this.timeoutNotification(2000);
      }
    });
  }

  onUpdateForm(id: number) {
    this.onUpdate = true;
    this.displayForm = true;
    this.bannerIdToDelete = id;
  }

  updateBanner() {
    if (!this.selectedFile || !this.bannerIdToDelete) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.bannerService.updateBanner(this.bannerIdToDelete, formData).subscribe({
      next: () => {
        this.getListBanner();
        this.closeForm();
        this.showNotification = true;
        this.message = 'Cập nhật banner thành công!';
        this.timeoutNotification(2000);
      },
      error: (err:any) => {
        console.error(err);
        this.showNotification = true;
        this.message = 'Cập nhật banner thất bại!';
        this.timeoutNotification(2000);
      }
    });
  }

  onDelete(id: number) {
    this.bannerIdToDelete = id;
    this.deleteForm = true;
  }

  deleteBanner() {
    if (!this.bannerIdToDelete) return;
    this.bannerService.deleteBanner(this.bannerIdToDelete).subscribe({
      next: () => {
        this.getListBanner();
        this.deleteForm = false;
        this.showNotification = true;
        this.message = 'Xóa banner thành công!';
        this.timeoutNotification(2000);
      },
      error: (err:any) => {
        console.error(err);
        this.showNotification = true;
        this.message = 'Xóa banner thất bại!';
        this.timeoutNotification(2000);
      }
    });
  }

  getBannerImage(id: number): string {
    return `http://localhost:8088/api/v1/banner/${id}`;
  }
}
