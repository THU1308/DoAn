import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LoginDto } from 'src/app/dto/login.dto';
import { enviroment } from 'src/app/enviroment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class ImageService{
    constructor(private http: HttpClient){
    }
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private getListImage = `${enviroment.apiBaseUrl}/image`;
    
    getListImages():Observable<any>{
        return this.http.get(this.getListImage,{headers:this.headers})
    }

    getListImgById(id : number){
      const url = `${enviroment.apiBaseUrl}/image/${id}`;
      return this.http.get(url, { headers: this.headers });
    }
}
