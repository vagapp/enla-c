import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { UserService } from '../app/api/user.service';
import { CommonService } from '../app/app/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from './api/globals.service';

import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private oneSignal: OneSignal,
    public menuctrl:MenuController,
    public US: UserService,
    public co: CommonService,
    public globals: GlobalsService,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  loginStatus(){

    this.US.getLoginStatus().subscribe(
      (res:any) => { 
        if(res.current_user === null){
          this.co.setRoot('/login');
          this.splashScreen.hide();
        }else{
          this.US.account = res;
          this.co.setRoot('/home');
        }
        
        this.statusBar.styleDefault();
      },
      (err: HttpErrorResponse) => { 
        this.co.presentAlert('Error','¡UPS!, tuvimos un provema verificando tu sesión!',err.error.message);
      }
    );

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.setupPush();        
      }else{
        this.loginStatus();
      }

    });
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('cc35a4d6-86d3-4cbe-bed2-326039767b28', '7626618721');
 
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      //let additionalData = data.payload.additionalData;
      this.showAlert(title, msg);
    });
 
    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;
 
      this.showAlert('Notification opened', 'You already read this before');
    });
 
    this.oneSignal.endInit();

    this.oneSignal.getIds().then(res => {
      this.US.playerID = res.userId;
      this.loginStatus();
    }).catch(err => {
      this.loginStatus();
    });


  }
 
  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    })
    alert.present();
    console.log('title =>',title);
  }


  onClickedOutside(e: Event) {
    //console.log('Clicked outside:', e);
    this.menuctrl.close();

  }
  logclick(){
    console.log('insideclick');
  }

  doLogout(){
    this.globals.showLoader();
    this.US.logout().subscribe(
      (res:any) => { 
        this.globals.hideLoader();
        this.US.account = res;
        console.log("respuesta ", res);
        this.onClickedOutside(null);
        this.co.setRoot('/login');
      },
      (err: HttpErrorResponse) => { 
        this.globals.hideLoader();
        console.log(err);
        var message = err.error.message;//'Intenta de nuevo';
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
       // this.co.presentAlert('Error','¡UPS!, hubo un problema al iniciar sesión.',message);
      }
    );
  }
}
