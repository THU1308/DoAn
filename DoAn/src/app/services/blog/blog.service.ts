import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Lấy danh sách blog
  getListBlog(): Observable<any> {
    const getListBlogUrl = `${enviroment.apiBaseUrl}/blog`;
    return this.http.get(getListBlogUrl, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Lấy thông tin chi tiết blog theo ID
  getBlogById(id: number): Observable<any> {
    const getBlogDetailsUrl = `${enviroment.apiBaseUrl}/blog/${id}`;
    return this.http.get(getBlogDetailsUrl, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Thêm blog mới
  createBlog(blogData: any): Observable<any> {
    const createBlogUrl = `${enviroment.apiBaseUrl}/blog`;
    return this.http.post(createBlogUrl, blogData, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Cập nhật blog
  updateBlog(id: number, blogData: any): Observable<any> {
    const updateBlogUrl = `${enviroment.apiBaseUrl}/blog/update/${id}`;
    return this.http.put(updateBlogUrl, blogData, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Xóa blog
  deleteBlog(id: number): Observable<any> {
    const deleteBlogUrl = `${enviroment.apiBaseUrl}/blog/delete/${id}`;
    return this.http.delete(deleteBlogUrl, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Xử lý lỗi HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => new Error('Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.'));
  }
}
