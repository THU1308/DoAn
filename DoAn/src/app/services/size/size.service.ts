import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';
import { SizeRequest } from 'src/app/request/size.request';


@Injectable({
  providedIn: 'root'
})
export class SizeService {
  constructor(private http: HttpClient) {
  }
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getListSize(): Observable<any> {
    const getListSzeUrl = `${enviroment.apiBaseUrl}/size`;
    return this.http.get(getListSzeUrl, { headers: this.headers })
  }

  getSizeById(id: number): Observable<any> {
    const getSizrDetailsUrl = `${enviroment.apiBaseUrl}/size/${id}`;
    return this.http.get(getSizrDetailsUrl, { headers: this.headers });
  }

  getSizeOfProduct(id: number): Observable<any> {
    const getSizeOfProductUrl = `${enviroment.apiBaseUrl}/size/productSizes/${id}`;
    return this.http.get(getSizeOfProductUrl, { headers: this.headers });
  }


  getSizeIdByName(sizeName: string): Observable<any> {
    const getSizeNameUrl = `${enviroment.apiBaseUrl}/size/findIdByName`;
    const params = new HttpParams().set('sizeName', sizeName);
    return this.http.get(getSizeNameUrl, { headers: this.headers, params });
  }

  // Tạo size mới
  createSize(size: SizeRequest): Observable<any> {
    const createSizeUrl = `${enviroment.apiBaseUrl}/size`;
    return this.http.post(createSizeUrl, size, { headers: this.headers });
  }

  // Cập nhật size
  updateSize(id: string, size: SizeRequest): Observable<any> {
    const updateSizeUrl = `${enviroment.apiBaseUrl}/size/${id}`;
    return this.http.put(updateSizeUrl, size, { headers: this.headers });
  }

  // Xóa size
  deleteSize(id: number): Observable<any> {
    const deleteSizeUrl = `${enviroment.apiBaseUrl}/size/${id}`;
    return this.http.delete(deleteSizeUrl, { headers: this.headers });
  }

}
