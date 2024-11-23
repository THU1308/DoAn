import { Component } from '@angular/core';
import { BannerService } from '../../services/banner/banner.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  listBanner: any = [];
  constructor(private bannerService: BannerService) {
    this.bannerService.getListBanner().subscribe({
      next: (response: any) => {
        //debugger
        this.listBanner = response.data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
