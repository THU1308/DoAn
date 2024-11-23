// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LoginDto } from 'src/app/dto/login.dto';
import { enviroment } from 'src/app/enviroment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
    listUser1 : any;

    private apiUrl = `${enviroment.apiBaseUrl}/login/signin`;


    constructor(private http: HttpClient) { }

  login(loginDto: LoginDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, loginDto, { headers, observe: 'response' })
  }
}
