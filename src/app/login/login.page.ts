import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { TermscondsPage } from '../termsconds/termsconds.page';
import { PasswordPage } from '../password/password.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required),
  });

  action : string = "login"; 

  constructor(
    public router: Router,
    public co: CommonService,
    public global: GlobalsService,
    public US: UserService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
  }

  navegar(url){
    this.router.navigateByUrl(url);
  }

  doLogin(data: any){
    if(data.email == null){
      this.co.presentAlert('Error','Por favor ingresa tu email.',"");
      return;
    }
    if(data.password == null){
      this.co.presentAlert('Error','Por favor ingresa tu password.',"");
      return;
    }
    this.global.showLoader();
    this.US.login(data.email,data.password).subscribe(
      (res:any) => { 
        console.log("AFTER LOGIN ", res);
        this.global.hideLoader();
        this.US.account = res;
        this.US.saveAuth(data.email,data.password);
        this.co.setRoot('/home');
        if(this.US.account.temp_login){
          this.co.presentAlert('Inicio de sesión','Haz iniciado sesión con una contraseña temporal, te recomendamos cambiarla.','');
          this.co.go('/configuracion');
        }
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
        this.global.hideLoader();
        var message = err.error.message;//'Intenta de nuevo';
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al iniciar sesión.',message);
      }
    );
  }

  segmentChanged(ev: any) {
      this.co.setRoot('/'+ev.detail.value);
  } 
  async openTermCond(id){
    this.US.nodo = id;
    const modal = await this.modalController.create({
      component: TermscondsPage
    });
    return await modal.present();
  }

  async openPassword(){
    const modal = await this.modalController.create({
      component: PasswordPage
    });
    return await modal.present();
  }
}