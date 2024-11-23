import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';
import { CategoryDto } from 'src/app/dto/category.dto';
import { Categoryrequest } from 'src/app/request/category.request';




@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Lấy danh sách tất cả các danh mục
  getListCategory(): Observable<any> {
    const getListCategoryUrl = `${enviroment.apiBaseUrl}/category`;
    return this.http.get(getListCategoryUrl, { headers: this.headers });
  }

  // Lấy thông tin danh mục theo ID
  get(id: number): Observable<any> {
    const getCategoryUrl = `${enviroment.apiBaseUrl}/category/${id}`;
    return this.http.get(getCategoryUrl, { headers: this.headers });
  }

  // Tạo danh mục mới
  createCategory(categoryrequest: Categoryrequest): Observable<any> {
    const createCategoryUrl = `${enviroment.apiBaseUrl}/category`;
    return this.http.post(createCategoryUrl, categoryrequest, { headers: this.headers });
  }

  // Cập nhật danh mục theo ID
  updateCategory(id: number, categoryrequest: Categoryrequest): Observable<any> {
    const updateCategoryUrl = `${enviroment.apiBaseUrl}/category/${id}`;
    return this.http.put(updateCategoryUrl, categoryrequest, { headers: this.headers });
  }

  // Kích hoạt danh mục
  enableCategory(id: number): Observable<any> {
    const enableCategoryUrl = `${enviroment.apiBaseUrl}/category/enable/${id}`;
    return this.http.put(enableCategoryUrl, null, { headers: this.headers });
  }

  // Xóa danh mục theo ID
  deleteCategory(id: number): Observable<any> {
    const deleteCategoryUrl = `${enviroment.apiBaseUrl}/category/${id}`;
    return this.http.delete(deleteCategoryUrl, { headers: this.headers });
  }
}
