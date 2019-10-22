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
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ModalAlarmPage } from 'src/app/modal-alarm/modal-alarm.page';
import { ModalLabPage } from 'src/app/modal-lab/modal-lab.page';
import { OneSignal } from '@ionic-native/onesignal/ngx';

import { NativeAudio } from '@ionic-native/native-audio/ngx';


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

  dataReturned:any;
  nid: any;
  todayS: any;
  datesOrigin: string[];
  selectedDate:any;

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
    private alertCtrl: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
    private datePipe: DatePipe,
    private nativeAudio: NativeAudio
  ) {
    this.initializeApp();

    this.platform.ready().then(() => {
      this.nativeAudio.unload('trackID').then(function() {
          console.log("unloaded audio!");
      }, function(err) {
          console.log("couldn't unload audio... " + err);
      });
      this.nativeAudio.preloadComplex('trackID', 'assets/audio/notienlac.mp3', 1, 1, 0).then(function() {
          console.log("audio loaded!");
      }, function(err) {
          console.log("audio failed: " + err);
      });
    });
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
      
      this.nativeAudio.play('trackID').then(function() {
        console.log("playing audio!");
      }, function(err) {
        console.log("errorrrr playing audio: " + err);
      });
      this.presentToast(msg);
      data.payload.sound = 'notienlac.wav';
      
    });
    
    
    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;
      let msg = data.notification.payload.body;
      let type = data.notification.payload.additionalData.type;
      
      
      if(type == 'alarma'){
        //miestro modal de alarmas de dosis
        this.openModal();
      }else if(type == 'prueba_medica'){
        //muestro modal de prueba media
        this.openModal2();
      }else{
        //muestro alert default
        this.showAlert( type.charAt(0).toUpperCase() + type.slice(1), msg);
      }
      
      

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

  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: "X"
    });
    toast.present();
  }

  loadDates(){
    console.log("entra");
    this.US.loaddosis().subscribe(
      resS => {
        console.log(resS);
        /*FECHA DE HOY*/
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        this.todayS = yyyy + '-' + mm + '-' +dd ;
        var count = Object.keys(resS).length;
        for(var i=0; i<count; i++){
          this.datesOrigin.push(this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd'));
        }
        this.US.dosisdia = Object.keys(this.datesOrigin).some(key => this.datesOrigin[key] == this.todayS);
        Object.keys(resS).forEach(key => {
          //console.log(resS[key].field_fecha_de_dosis)
          if (this.datePipe.transform(resS[key].field_fecha_de_dosis, 'yyyy-MM-dd') == this.todayS) {
              console.log("Found.");
              this.nid = resS[key].nid;
              console.log(this.nid);
          }
      });
        //console.log(Object.keys(this.datesOrigin).some(key => this.datesOrigin[key] == this.todayS))
        //this.nid = (this.bandera) ? 
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }

  async openModal() {

    //this.loadDates();
    
    /*COMPROBAMOS QUE NO HAYAMOS HECHO CHECK HOY */
    
    
    //this.classId = (this.US.dosisdia) ? true :  false;

    const modal = await this.modalController.create({
      component: ModalAlarmPage,
      cssClass: 'modalCss',
      componentProps: {'Paramdate': this.todayS,'activo':this.US.dosisdia, 'nid': this.nid, 'home': true}
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
 
    return await modal.present();
  }

  async openModal2() {
    
    const modal2 = await this.modalController.create({
      component: ModalLabPage,
      cssClass: 'modalCss',
      componentProps: { 
        fecha_param:this.selectedDate
      }
    });
 
    modal2.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
 
    return await modal2.present();
  }

}
