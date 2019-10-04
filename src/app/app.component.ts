import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { UserService } from '../app/api/user.service';
import { CommonService } from '../app/app/common.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    public co: CommonService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.router.navigateByUrl('/login');
      this.splashScreen.hide();
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
    this.US.logout().subscribe(
      (res:any) => { 
        this.US.account = res;
        console.log("respuesta ", res);
        this.onClickedOutside(null);
        this.co.setRoot('/login');
      },
      (err: HttpErrorResponse) => { 
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
