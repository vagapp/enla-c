import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });

  constructor(
    public router: Router,
    public co: CommonService,
    public global: GlobalsService,
    public US: UserService
  ) {}

  ngOnInit() {}

  navegar(url){
    //console.log("hola");
    this.router.navigateByUrl(url);
  }

  doLogin(data){
    console.log("quien soy", data.email,data.password);
    this.global.showLoader();
    
    this.US.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.global.hideLoader();
        
        this.US.account = res;

        console.log("respuesta ", this.US.account);
        this.co.setRoot('/home');
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

}
