import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { GlobalsService } from '../api/globals.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlarmasService {
  tipo:string = "alarma";
  constructor(
    public US: UserService,
    public global: GlobalsService,
    private http: HttpClient) { }

  creaAlarma(hora:string, zona_horaria:number){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    let data = {
      "type":[{"target_id":this.tipo}],
      "title":[{"value":this.US.account.current_user.uid}],
      "field_hora_alarma":[{"value":hora}],
      "field_zona_horaria":[{"value":zona_horaria}],
      "field_status":[{"value":true}]
    };

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

  getAalarma(){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    return this.http.get<Array<any>>(this.global.API+'/api/alarmas/'+this.US.account.current_user.uid+'?_format=json',
      { headers: headers, withCredentials: true }
    );
  }

  actualizaAlarma(status:boolean, nid:number, hora:string){
    let data:any;
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.US.account.csrf_token
    });
    if(hora == undefined){
      data = {
        "type":[{"target_id":this.tipo}],
        "field_status":[{"value":status}]
      };
    }else{
      data = {
        "type":[{"target_id":this.tipo}],
        "field_hora_alarma":[{"value":hora}]
      };
    }
    
    console.log("data",data);
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