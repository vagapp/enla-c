import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alarma',
  templateUrl: './alarma.page.html',
  styleUrls: ['./alarma.page.scss'],
})
export class AlarmaPage implements OnInit {

  name_head: any;
  date_head: any;

  constructor(
    private US: UserService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.US.getLoginStatus().subscribe(
      res => { 
        this.name_head = res.current_user.fullname;
        this.date_head = this.datePipe.transform(res.current_user.fecha_inicio_tratamiento,'dd-MM-yyyy');
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }

}
