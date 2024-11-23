import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";

@Injectable({
    providedIn:'root'
})
export class TokenInterceptor implements HttpInterceptor{
    constructor(private tokenService : TokenService){}
    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.tokenService.getToken()){
            req = req.clone({
                setHeaders:{
                    Authorization : `Bearer ${this.tokenService.getToken()}`
                }
            })
        }
        return next.handle(req);
    }
}
