import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertPage } from '../alert/alert.page';
import { UserService } from '../api/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  dataReturned:any;
  name_head: any;
  date_head: any;

  constructor(
    public modalController: ModalController,
    private US: UserService,
    private datePipe: DatePipe
  ) {}

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

  async openModal3() {
    const modal = await this.modalController.create({
      component: AlertPage,
      cssClass: 'modalCss'
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
 
    return await modal.present();
  }
}
