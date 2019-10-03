// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
//import { GlobalsService } from '../api/globals.service';
//import { PaymentMethod } from '../api/payments.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

declare var window: any;
declare var document: Document;
declare var Tawk_API: any;

export interface Account{
  csrf_token: string;
  logout_token: string;
  current_user: CurrentUser;
  tawk_to: string;
  unreaded: number;
  temp_login: boolean;
}
export interface CurrentUser{
  name: string;
  roles: Array<string>;
  uid: string;
  user_picture: string;
  email: string;
  fullname: string;
  vision: string;
  programas: Array<Programa>;
  suscripcion: SubscriptionConekta;
  //payment_methods: Array<PaymentMethod>;
  sexo:Array<string>;
  edad:string;
}
export interface Programa{
  tid: string;
  name: string;
  icono: string;
  icono_color: string;
}
export interface SubscriptionConekta{
  id: string;
  status: string;
  object: string;
  charge_id: string;
  created_at: number;
  subscription_start: number;
  billing_cycle_start: number;
  billing_cycle_end: number;
  plan_id: string;
  customer_id: string;
  card_id: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _account:Account;
  private _playerID:string = 'undefined';
  tawkId: string = '5ce57b9dd07d7e0c6394e428';

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
    //private global: GlobalsService,
    public alertController: AlertController,
    public router: Router
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

  register(name:string, mail:string, pass:string, field_fecha_de_nacimiento:string, field_inicio_del_tratamiento:string, field_institucion:string, field_nombre_completo:string, field_sexo:string){
    
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    var sx = [];
    let sex = sexo.split(',');
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
      "field_sexo":sx,
      "field_edad": [{ "value":edad }],
      //"field_programas": pr,
      "field_nombre": [{ "value": nombre }],
      "user_picture": fid != '' ? [{ "target_id" : fid }] : []
    };
    //console.log(datos);
    return this.http.post<Account>(
      'https://enla-c-site.vagapp.mx/user/register?_format=json',
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
      'user/login?_format=json',
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
  logout(){
    return this.http.get<Account>(
      'user/clogout?_format=json',
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

  updateProgramas(userid, tid, process){
    let targets : any[] = this.buildProgramasJson(tid, process);
    let data = {
      "field_programas":targets
    };
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token,
      'Accept':'application/json',
      'Authorization':'Basic'
    });

    return this.http.patch('user/'+userid+'?_format=json', 
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

  buildProgramasJson(tid, process){
    let jsonArr : any[] = [];
    for (var i = 0; i < this.account.current_user["programas"].length; i++) {
      jsonArr.push({"target_id": this.account.current_user["programas"][i].tid})
    }
    if(process == "follow"){
      jsonArr.push({"target_id": tid})
    }else if(process == "unfollow"){
      jsonArr = jsonArr.filter(function( obj ) {
        return obj.target_id !== tid;
    });
    }
    return jsonArr 
  }

  updateVision(vision:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    let datos = {
      "field_mi_vision": [{ "value":vision }],
    };
    //console.log(datos);
    return this.http.patch<any>(
      'user/'+this.account.current_user.uid+'?_format=json',
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

  // openChat(){
  //   this.global.showLoader();
  //   this.getLoginStatus().subscribe(
  //     (res) => {
  //       this.global.hideLoader();
  //       this.account = res;
  //       console.log(this.account);
  //       var basic = this.account.current_user.roles.includes('basico') || this.account.current_user.roles.includes('premium') || this.account.current_user.roles.includes('premium_anual') ? true : false;
  //       if(basic){
  //         this.alertBasic();
  //       }else{
  //         if(window.Tawk_API === undefined){
  //           const s = document.createElement('script');
  //           s.setAttribute('id','tawk-to-script');
  //           s.text = `var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
  //             (function () {
  //               var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  //               s1.setAttribute("tawk-to-script", "Div1");
  //               s1.async = true;
  //               s1.src = 'https://embed.tawk.to/`+this.tawkId+`/default';
  //               s1.charset = 'UTF-8';s1.setAttribute('crossorigin', '*');
  //               s0.parentNode.insertBefore(s1, s0);
  //             })();
  //             Tawk_API.onLoad = function(){
  //               Tawk_API.setAttributes({
  //                 'name'  : '`+this.account.current_user.fullname+`',
  //                 'email' : '`+this.account.current_user.email+`'
  //               }, function(error){});
  //               Tawk_API.maximize();
  //               var globo = document.getElementById('tawkchat-container').firstChild;
  //               //console.log(globo);
  //               var observer = new MutationObserver(function(mutations) {
  //                 mutations.forEach(function(mutation) {
  //                   var style = globo.getAttribute('style');
  //                   if(style.includes('display: block !important;')){
  //                     style = style.replace('display: block !important;','display: none !important;');
  //                     globo.setAttribute('style',style);
  //                   }
  //                 });
  //               });
  //               observer.observe(globo, { attributes: true });
  //             };
  //             `;
  //           document.body.appendChild(s)
  //         }else{
  //           Tawk_API.toggle();
  //         }
  //       }
  //     }
  //   );
  // }

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

  setProgramas(programas:any){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    let data : any;    
    data = {
      "field_programas": programas
    };
    
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

  updateUserPic(fid:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token
    });
    let data = {
      "user_picture": fid != '' ? [{ "target_id" : fid }] : []
    };
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

  countViews(){
    return this.http.get<any>('api/contadores?_format=json',{ withCredentials: true }).pipe(
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

}
