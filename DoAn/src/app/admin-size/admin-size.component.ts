import { Component } from '@angular/core';
import { SizeService } from '../services/size/size.service';
import { SizeRequest } from '../request/size.request';

@Component({
  selector: 'app-admin-size',
  templateUrl: './admin-size.component.html',
  styleUrls: ['./admin-size.component.scss']
})
export class AdminSizeComponent {
  listSize: SizeRequest[] = [];
  sizeForm : any = { id: null, name: null };
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

  constructor(private sizeService: SizeService) { }

  ngOnInit(): void {
    this.getListSize();
  }

  // Lấy danh sách size
  getListSize() {
    this.sizeService.getListSize().subscribe({
      next: (res) => {
        this.listSize = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Hiển thị modal
  showModal(type: string, size?: any) {
    this.modalType = type;
    this.sizeForm = size ? { ...size } : new SizeRequest('');
  }

  // Đóng modal
  closeModal() {
    this.modalType = null;
  }

  // Thêm size
  createSize() {
    this.sizeService.createSize(new SizeRequest(this.sizeForm.name)).subscribe({
      next: () => {
        this.getListSize();
        this.notification("Thêm size thành công!");
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notification("Đã xảy ra lỗi khi thêm size.");
      },
    });
  }

  // Cập nhật size
  updateSize() {
    this.sizeService.updateSize(this.sizeForm.id, new SizeRequest(this.sizeForm.name)).subscribe({
      next: () => {
        this.getListSize();
        this.notification("Cập nhật size thành công!");
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notification("Đã xảy ra lỗi khi cập nhật size.");
      },
    });
  }

  // Xóa size
  deleteSize() {
    this.sizeService.deleteSize(this.sizeForm.id).subscribe({
      next: () => {
        this.getListSize();
        this.notification("Xóa size thành công!");
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.notification("Đã xảy ra lỗi khi xóa size.");
      },
    });
  }
}
