import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getListProduct(): Observable<any> {
    const getListProductUrl = `${enviroment.apiBaseUrl}/product`;
    return this.http.get(getListProductUrl, { headers: this.headers });
  }

  getListNewest(): Observable<any> {
    const getListNewestUrl = `${enviroment.apiBaseUrl}/product/listnew/8`;
    return this.http.get(getListNewestUrl, { headers: this.headers });
  }

  getProductById(id: number): Observable<any> {
    const url = `${enviroment.apiBaseUrl}/product/${id}`;
    return this.http.get(url, { headers: this.headers });
  }

  getProductByCategoryId(id: number): Observable<any> {
    const getProductByCategoryIdUrl = `${enviroment.apiBaseUrl}/product/category/${id}`;
    return this.http.get(getProductByCategoryIdUrl, { headers: this.headers });
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<any> {
    const apiUrl = `${enviroment.apiBaseUrl}/product/price-range`;
    const params = new HttpParams()
      .set('minPrice', minPrice)
      .set('maxPrice', maxPrice);

    return this.http.get(apiUrl, { headers: this.headers, params });
  }

  sortProductsByPrice(sortType: string): Observable<any> {
    const url = `${enviroment.apiBaseUrl}/product/sort?sortType=${sortType}`;
    return this.http.get(url, { headers: this.headers });
  }

  getSuggestions(name: string): Observable<any> {
    const apiUrl = `${enviroment.apiBaseUrl}/product/search`;
    const params = new HttpParams().set('name', name).set('limit', '5'); // Giới hạn kết quả

    return this.http.get(apiUrl, { headers: this.headers, params });
  }

  getListImageByProductId(productId: number) {
    const apiUrl = `${enviroment.apiBaseUrl}/product/image`;
    const params = new HttpParams().set('productId', productId);
    return this.http.get(apiUrl, { headers: this.headers, params });
  }

  addProduct(product: any): Observable<any> {
    const apiUrl = `${enviroment.apiBaseUrl}/product`;
    return this.http.post<any>(apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    const apiUrl = `${enviroment.apiBaseUrl}/product`;
    return this.http.put<any>(`${apiUrl}/update/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    const apiUrl = `${enviroment.apiBaseUrl}/product`;
    return this.http.delete<void>(`${apiUrl}/delete/${id}`);
  }

   // Method to upload multiple files (images)
   uploadFiles(files: File[]): Observable<any> {
    const formData = new FormData();

    // Append each file to the FormData object
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    const apiUrl = `${enviroment.apiBaseUrl}/image/upload`;

    // Send a POST request to upload the files
    return this.http.post<any>(`${apiUrl}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

   // Method to handle errors
   private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    return throwError(errorMessage);
  }
}
