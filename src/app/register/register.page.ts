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
    
   

  }

}
