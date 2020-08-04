import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './api/user.service';
import { tap, finalize } from 'rxjs/operators';
import { CommonService } from './app/common.service';
import { GlobalsService } from './api/globals.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(
    private US: UserService,
    private global: GlobalsService
  ){}
  
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercepting req',req);
   /*
    return next.handle(req.clone()).pipe(finalize( () => {
      this.global.hideLoader();
    }));
    */
    return next.handle(req.clone({setHeaders: this.getAuthHeaders() })).pipe(finalize( () => {
      this.global.hideLoader();
    }));

/*console.log('intercepting req',req);
    if(!req.url.includes('clogin')){
    return next.handle(req.clone({setHeaders: this.getAuthHeaders(), withCredentials:true })).pipe(finalize( () => {
      this.global.hideLoader();
    }));
    }else{
      console.log('its login');
      return next.handle(req.clone()).pipe(finalize( () => {
        this.global.hideLoader();
      }));
    }*/
  }

  getAuthHeaders(){
    let ret = {'Content-Type':'application/json'
               };
    if(this.US.account && this.US.account.csrf_token) ret['X-CSRF-Token']=`${this.US.account.csrf_token}`;
    if(this.US.user && this.US.pass && !this.US.settingsession){
       ret['Authorization']='Basic ' + btoa(this.US.user+':'+this.US.pass);
     }else{
       console.log('not auth basic saved');
     }
    return  ret;
   }
   
}
