// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LoginDto } from 'src/app/dto/login.dto';
import { enviroment } from 'src/app/enviroment/enviroment';
import { UserRequest } from 'src/app/request/user.request';


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

  // Lấy thông tin người dùng theo username
  getUserByUsername(username: string): Observable<any> {
    const getUserByUsername = `${enviroment.apiBaseUrl}/user`;
    const params = new HttpParams().set('username', username);
    return this.http.get(`${getUserByUsername}`, { params ,headers : this.headers});
  }

  // Lấy danh sách người dùng
  getListUsers(): Observable<any> {
    const listUser = `${enviroment.apiBaseUrl}/user/listUser`;
    return this.http.get(`${listUser}`,{headers:this.headers});
  }

  // Lấy danh sách nhân viên (admin only)
  // getListEmployees(): Observable<> {
  //   return this.http.get<>(`${this.apiUrl}/employee`);
  // }

  // Cập nhật thông tin người dùng
  updateProfile(userRequest: UserRequest): Observable<any> {
    const updateUser = `${enviroment.apiBaseUrl}/user/update`;
    return this.http.put(`${updateUser}`, userRequest,{headers:this.headers});
  }

  // Cập nhật vai trò người dùng (admin only)
  updateUserRole(username: string): Observable<any> {
    const updateRole = `${enviroment.apiBaseUrl}/user/updateRole`;
    const params = new HttpParams().set('username', username);
    return this.http.put(`${updateRole}`, null,{ params, headers:this.headers});
  }

  // Kích hoạt hoặc vô hiệu hóa nhân viên
  enableEmployee(username: string): Observable<any> {
    const enableUser = `${enviroment.apiBaseUrl}/user/enable`;
    const params = new HttpParams().set('username', username);
    return this.http.put(`${enableUser}`, null, { params,headers:this.headers });
  }

  // Reset mật khẩu người dùng
  resetPassword(email: string): Observable<any> {
    const resetPassword = `${enviroment.apiBaseUrl}/user/resetPw`;
    const params = new HttpParams().set('email', email);
    return this.http.post(`${resetPassword}`, null, { params,headers:this.headers });
  }
}
