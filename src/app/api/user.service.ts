import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {GlobalsService} from '../api/globals.service';

export interface Account{
  current_user: CurrentUser;
  csrf_token: string;
  logout_token: string;
  temp_login: boolean;
}
export interface CurrentUser{
  uid: string;
  name: string;
  sexo: Array<string>;
  email: string;
  fullname: string;
  institucion: Array<string>;
  fecha_nacimiento: string;
  fecha_inicio_tratamiento: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private _account:Account;
  private _playerID:string = 'null';

  get account(): Account{
    return this._account;
  }
  set account(account: Account){
    this._account = account;
  }

  get playerID(): string{
    return this._playerID;
  }
  set playerID(playerID:string){
    this._playerID = playerID;
  }

  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    public router: Router,
    public global : GlobalsService
  ) { }
  getLoginStatus(){
    return this.http.get<Account>('user/me/'+this.playerID+'?_format=json',{ withCredentials: true }).pipe(
      map(
        res => { 
          return res;
        },
        (err: HttpErrorResponse) => { 
          //console.log("provema",err);
        }
      )
    );
  }

  login(username : string, password : string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    let datos = this.playerID != null ? {
      "name":username,
      "pass":password,
      "playerid": this.playerID
    } : {
      "name":username,
      "pass":password
    };
    return this.http.post<Account>(
      this.global.API+'user/clogin?_format=json',
      JSON.stringify(datos),
      { headers: headers, withCredentials: true }).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }
  logout(){
    return this.http.get<Account>(
      this.global.API+'user/clogout?_format=json',
      { withCredentials: true }).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            //console.log(err);
          }
        )
      );
  }
  resetPassword(email){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    let datos = {
      "mail":email,
    };
    return this.http.post<any>(
      'user/lost-password?_format=json',
      JSON.stringify(datos),
      { headers: headers, withCredentials: true }).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            //console.log(err);
          }
        )
      );
  }

  async alertBasic(){
    const alert = await this.alertController.create({
      header: 'Suscripción',
      message: 'No dejes incompleto tu cambio, suscríbete a un Plan Plus y ten acceso al Chat de Contención.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: '¡Seleccionar Plan!',
          handler: () => {
            alert.dismiss();
            this.router.navigateByUrl("/planes");
          }
        }
      ]
    });

    await alert.present();
  }

  updateUserData(info:any, programas:any, chgpass:boolean){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    let data : any;    
    if(chgpass){
      data = {
        "field_nombre":[
           {"value": info.nombre }
         ],
        "field_edad":[
           {"value":info.edad}
        ],
        "field_sexo":[
          {"target_id": info.sexo }
        ],
        "mail":[
          {"value":info.email}
        ],
        "pass": [
          {"existing":info.currentPassword, "value": info.password}
        ],
        "field_programas": programas
      };
    }else{
      data = {
        "field_nombre":[
           {"value": info.nombre }
         ],
        "field_edad":[
           {"value":info.edad}
        ],
        "field_sexo":[
          {"target_id": info.sexo }
        ],
        "mail":[
          {"value":info.email}
        ],
        "field_programas": programas
      };
    }
    
    //console.log("DATA",data)
    return this.http.patch<any>(
      'user/'+this.account.current_user.uid+'?_format=json',
      JSON.stringify(data),
      { headers: headers, withCredentials: true }).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            //console.log(err);
          }
        )
      );
  }
}
