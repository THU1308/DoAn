import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) {
  }
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getListTag(): Observable<any> {
    const getListSzeUrl = `${enviroment.apiBaseUrl}/tag`;
    return this.http.get(getListSzeUrl, { headers: this.headers })
  }
  
}
