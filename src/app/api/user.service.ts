import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {GlobalsService} from '../api/globals.service';
import { Storage } from '@ionic/storage';

export interface Account{
  current_user: CurrentUser;
  csrf_token: string;
  logout_token: string;
  temp_login: boolean;
}
export interface CurrentUser{
  uid: string;
  name: string;
  apellidos: string;
  sexo: Array<string>;
  email: string;
  codigo_postal: string;
  fullname: string;
  institucion: Array<string>;
  fecha_nacimiento: string;
  fecha_inicio_tratamiento: string;
  fecha_fin_tratamiento: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  static duracion_tratamiendo:number = 84;
  public _account:Account;
  private _playerID:string = 'null';
  public _nodo:any = 1;
  private _dosisdia: boolean;
  _user: string;
  _pass: string;
  settingsession: any;

  get nodo():any{
    return this._nodo;
  }
  set nodo(id:any){
    this._nodo = id;
  }

  get dosisdia(): boolean{
    return this._dosisdia;
  }
  
  set dosisdia(dosisdia: boolean){
    this._dosisdia = dosisdia;
  }

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
    public global : GlobalsService,
    public storage: Storage
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

  loadclinic(){
    
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
    console.log('registerdosis field fecha dosis',field_fecha_de_dosis);
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
      this.global.API+'api/dosis/'+this.account.current_user.uid+'?_format=json',
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

  removedosis(nid:string){
    console.log("remove")
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    
    return this.http.delete(
      this.global.API+'node/'+nid+'?_format=json',
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

  register(name:string, lastname:string, mail:string, pass:string, field_fecha_de_nacimiento:string, field_inicio_del_tratamiento:string, field_fin_del_tratamiento:string, field_institucion:string, field_nombre_completo:string, field_sexo:string, field_codigo_postal:string){
    
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
      "field_apellidos": [{ "value":lastname }],
      "mail": [{ "value":mail }],
      "pass": [{ "value":pass }],
      "field_fecha_de_nacimiento": [{ "value":field_fecha_de_nacimiento }],
      "field_inicio_del_tratamiento": [{ "value":field_inicio_del_tratamiento }],
      "field_fin_del_tratamiento": [{ "value":field_fin_del_tratamiento }],
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
      this.global.API+'user/lost-password?_format=json',
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
        "field_apellidos": [{ "value":info.field_apellidos }],
        "mail": [{ "value": info.mail }],
        "field_fecha_de_nacimiento": [{ "value": info.field_fecha_de_nacimiento }],
        "field_inicio_del_tratamiento": [{ "value": info.field_inicio_del_tratamiento }],
        "field_fin_del_tratamiento": [{ "value": info.field_fin_del_tratamiento }],
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
        "field_apellidos": [{ "value":info.field_apellidos }],
        "mail": [{ "value": info.mail }],
        "field_fecha_de_nacimiento": [{ "value": info.field_fecha_de_nacimiento }],
        "field_inicio_del_tratamiento": [{ "value": info.field_inicio_del_tratamiento }],
        "field_fin_del_tratamiento": [{ "value": info.field_fin_del_tratamiento }],
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
  termsCond(){
    return this.http.get<Account>(
      this.global.API+'node/'+this.nodo+'?_format=json',
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

  calcularSemanas(inicio:string):string{
    console.log('calcularSemanas',inicio);
    let aux_date = new Date(inicio);
    aux_date.setDate( aux_date.getDate() + UserService.duracion_tratamiendo);
    console.log('calcularSemanas',inicio,aux_date,aux_date.toISOString());
    return aux_date.toISOString();
  }


  set user(user:string){ this._user = user; }
  set pass(pass:string){ this._pass = pass; }
  get pass(){ return this._pass; }
  get user(){ return this._user; }

  saveAuth(usr,pass){
    this.user = usr;
    this.pass = pass;
    this.storage.set('usr',usr);
    this.storage.set('pass',pass);
  }
  async getAuth(){
    console.log('getting Auth');
    await this.storage.get('usr').then( res => this.user = res );
    await this.storage.get('pass').then( res => this.pass = res );
    console.log('authb user',this.user);
    console.log('authb pass',this.pass);
  }
  removeAuth(){
    this.storage.remove('usr');
    this.storage.remove('pass');
    this.user = null;
    this.pass = null;
  }

}
