import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  API: string = 'https://enla-c-site.vagapp.mx/';
  PRIMARY_DOMAIN: string = 'https://enla-c-site.vagapp.mx';
  loader: any = null;

  constructor(
    public loadingCtrl: LoadingController,
    public events: Events,
    private http: HttpClient,
    public alertController: AlertController,
  ) {}
  
  async showLoader(){
    if(this.loader == null){
      this.loader = await this.loadingCtrl.create({
        spinner: 'crescent'
      });
      await this.loader.present();
    }
  }

  hideLoader(){
    if(this.loader != null){
      this.loader.dismiss();
      this.loader = null;
    }
  }

  getTaxonomy(vocab){
    return this.http.get<Array<any>>(this.API+'api/taxonomia/'+vocab+'?_format=json',{ withCredentials: true }).pipe(
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

  async presentAlert(HEADER,SUBHEADER,MESSAGE) {
    const alert = await this.alertController.create({
      header: HEADER,
      subHeader: SUBHEADER,
      message: MESSAGE,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
