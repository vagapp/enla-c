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
  codigo_postal: string;
  fullname: string;
  institucion: Array<string>;
  fecha_nacimiento: string;
  fecha_inicio_tratamiento: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public _account:Account;
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
    return this.http.get<Account>(this.global.API+'user/me/'+this.playerID+'?_format=json',{ withCredentials: true }).pipe(
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

  loadsexos(){
    return this.http.get<Account>(
      this.global.API+'/api/sexos?_format=json',
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


  loadinsti(){
    return this.http.get<Account>(
      this.global.API+'/api/instituciones?_format=json',
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

  loadcps(cp){
    cp = (cp == '') ? 0 : cp;
    return this.http.get<Account>(
      this.global.API+'/postal_codes/'+cp,
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

  loadarticles(){
    return this.http.get<Account>(
      this.global.API+'/api/articulos?_format=json',
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

  loadclinic(institucion, cp){
    
    return this.http.get<Account>(
      this.global.API+'/instituciones_cercanas',
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

  registerdosis(title:string, field_fecha_de_dosis:string){
    
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    
    let datos = {
      "type":[{"target_id": "dosis_diaria"}],
      "title":[{"value": title}],
      "field_fecha_de_dosis":[{"value":field_fecha_de_dosis}]
    };
    return this.http.post<Account>(
      this.global.API+'node?_format=json',
      JSON.stringify(datos),
      { headers: headers, withCredentials: true }).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
          }
        )
      );
  }

  loaddosis(){
    
    return this.http.get<Account>(
      this.global.API+'api/dosis?_format=json',
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



  register(name:string, mail:string, pass:string, field_fecha_de_nacimiento:string, field_inicio_del_tratamiento:string, field_institucion:string, field_nombre_completo:string, field_sexo:string, field_codigo_postal:string){
    
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    var sx = [];
    let sex = field_sexo.split(',');
    sex.forEach(value => {
      sx.push({ "target_id":value });
    });
    /*var pr = [];
    let pro = programas.split(',');
    pro.forEach(value => {
      pr.push({ "target_id":value });
    });*/
    let datos = {
      "name": [{ "value":mail }],
      "mail": [{ "value":mail }],
      "pass": [{ "value":pass }],
      "field_fecha_de_nacimiento": [{ "value":field_fecha_de_nacimiento }],
      "field_inicio_del_tratamiento": [{ "value":field_inicio_del_tratamiento }],
      "field_institucion": [{ "target_id":field_institucion }],
      "field_nombre_completo": [{ "value":field_nombre_completo }],
      "field_sexo":sx,
      "field_codigo_postal": [{ "value":field_codigo_postal }]
    };
    //console.log(datos);
    return this.http.post<Account>(
      this.global.API+'user/register?_format=json',
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

  login(username,password){
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

  updateUserData(info:any, chgpass:boolean){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    let data : any;
    var sx = [];
    let sex = info.field_sexo.split(',');
    sex.forEach(value => {
      sx.push({ "target_id":value });
    });
    
    if(chgpass){
      data = {
        "name": [{ "value": info.mail }],
        "mail": [{ "value": info.mail }],
        "field_fecha_de_nacimiento": [{ "value": info.field_fecha_de_nacimiento }],
        "field_inicio_del_tratamiento": [{ "value": info.field_inicio_del_tratamiento }],
        "field_institucion": [{ "target_id": info.field_institucion }],
        "field_nombre_completo": [{ "value": info.field_nombre_completo }],
        "field_sexo":sx,
        "field_codigo_postal": [{ "value":info.field_codigo_postal }],
        "pass": [
          {"existing":info.currentPassword, "value": info.password}
        ]
      };
    }else{
      data = {
        "name": [{ "value": info.mail }],
        "mail": [{ "value": info.mail }],
        "field_fecha_de_nacimiento": [{ "value": info.field_fecha_de_nacimiento }],
        "field_inicio_del_tratamiento": [{ "value": info.field_inicio_del_tratamiento }],
        "field_institucion": [{ "target_id": info.field_institucion }],
        "field_nombre_completo": [{ "value": info.field_nombre_completo }],
        "field_sexo":sx,
        "field_codigo_postal": [{ "value":info.field_codigo_postal }],
      };
    }
    
    //console.log("DATA",data)
    return this.http.patch<any>(
      this.global.API+'user/'+this.account.current_user.uid+'?_format=json',
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
