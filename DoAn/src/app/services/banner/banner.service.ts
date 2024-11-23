import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LoginDto } from 'src/app/dto/login.dto';
import { enviroment } from 'src/app/enviroment/enviroment';


@Injectable({
  providedIn: 'root'
})

export class BannerService {
    constructor(private http: HttpClient){
    }
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    private baseUrl = `${enviroment.apiBaseUrl}/banner`;
    
    getListBanner(): Observable<any> {
      const listBannerUrl = this.baseUrl;
      return this.http.get(listBannerUrl);
    }
  

    // Tạo Banner mới
  createBanner(formData: FormData): Observable<any> {
    const createBannerUrl = this.baseUrl;
    return this.http.post(createBannerUrl, formData);
  }

  // Cập nhật Banner
  updateBanner(id: number, formData: FormData): Observable<any> {
    const updateBannerUrl = `${this.baseUrl}/${id}`;
    return this.http.put(updateBannerUrl, formData);
  }

  // Xóa Banner
  deleteBanner(id: number): Observable<any> {
    const deleteBannerUrl = `${this.baseUrl}/${id}`;
    return this.http.delete(deleteBannerUrl);
  }

  // Lấy hình ảnh Banner
  getBannerImage(id: number): string {
    return `${this.baseUrl}/${id}`;
  }
  
}