import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { GlobalsService } from '../api/globals.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {
  tipo:string = "prueba_medica";
  constructor(
    public US: UserService,
    public global: GlobalsService,
    private http: HttpClient) { }

  creaPruebaMed(date:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    let data = {
      "type":[{"target_id":this.tipo}],
      "title":[{"value":this.US.account.current_user.uid}],
      "field_fecha_prueba":[{"value":date}],
      "field_status_pruebamed":[{"value":1}]
    };
    console.log("dats",data);
    return this.http.post(this.global.API+'node?_format=json',
    JSON.stringify(data),
    { headers: headers, withCredentials: true }).pipe(
      map(
        res => { 
          return res;
        },
        (err: HttpErrorResponse) => { 
          return err;
        }
      )
    );
  }

  getPruebasMed(){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    return this.http.get<Array<any>>(this.global.API+'/api/pruebasmed/'+this.US.account.current_user.uid+'?_format=json',
      { headers: headers, withCredentials: true }
    );
  }

  updateHorasReminer(hora_reminder:string, nid:number){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    let data = {
      "type":[{"target_id":this.tipo}],
      "field_hora_reminder":[{"value":hora_reminder}]
    };

    return this.http.patch(this.global.API+'node/'+nid+'?_format=json', 
    JSON.stringify(data),
    { headers: headers, withCredentials: true }).pipe(
      map(
        res => { MessageChannel
          return res;
        },
        (err: HttpErrorResponse) => { 
          return err;
        }
      )
    );
  }

  updatePruebasMed(fecha:string,nid:number, status: boolean){
    let data:any;
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    if(fecha != undefined){
      data = {
        "type":[{"target_id":this.tipo}],
        "field_fecha_prueba":[{"value":fecha}]
      };
    }else{
        data = {
        "type":[{"target_id":this.tipo}],
        "field_status_pruebamed":[{"value":status}]
      };
    }
    
    return this.http.patch(this.global.API+'node/'+nid+'?_format=json', 
    JSON.stringify(data),
    { headers: headers, withCredentials: true }).pipe(
      map(
        res => { MessageChannel
          return res;
        },
        (err: HttpErrorResponse) => { 
          return err;
        }
      )
    );
  }


}