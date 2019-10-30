import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GlobalsService } from '../api/globals.service';
import { UserService } from '../api/user.service';
import { CommonService } from '../app/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  password_data = new FormGroup({
    email: new FormControl(null,Validators.required)
  });

  constructor(
    public modalController: ModalController,
    public global: GlobalsService,
    public US: UserService,
    public co: CommonService
  ) { }

  ngOnInit() {
  }

  closeModal(){
    this.modalController.dismiss();
  }

  requestPassword(data){
    this.global.showLoader();
    this.US.resetPassword(data.email).subscribe(
      res => {
        this.global.hideLoader();
        this.co.presentAlert('Recuperar Contraseña','','Hemos enviado a tu correo electrónico las instrucciones para restablecer tu contraseña');
        this.modalController.dismiss();
      },
      (err:HttpErrorResponse) => {
        this.global.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'El correo no ha sido encontrado o es inválido.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al recuperar contraseña.',message);
      }
    );
  }

}
