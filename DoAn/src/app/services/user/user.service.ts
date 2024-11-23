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
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

  login(loginDto: LoginDto): Observable<any> {
    const loginUrl = `${enviroment.apiBaseUrl}/login/signin`;
    return this.http.post(loginUrl, loginDto, { headers: this.headers });
  }

  getCurrenUserLogin(){
    const getCurrenUserLogin = `${enviroment.apiBaseUrl}/user/current-user`;
    return this.http.get(getCurrenUserLogin,{headers:this.headers})
  }
}
