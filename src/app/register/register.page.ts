import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private US: UserService
  ) { }

  ngOnInit() {
    
    this.US.register("ara13_0191@hotmail.com", "123456", "2", "28", "2", "Araceli Cruz", "").subscribe(
    //this.US.register(data.email, data.password, data.sexo, edad, data.programas, data.nombre, this.image_result != null ? this.image_result.fid : '').subscribe(
      res => { 
        console.log(res);
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );

  }

}
