import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { UserService } from '../app/api/user.service';
import { CommonService } from '../app/app/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from './api/globals.service';

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
    public menuctrl:MenuController,
    public US: UserService,
    public co: CommonService,
    public globals: GlobalsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
    });
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
