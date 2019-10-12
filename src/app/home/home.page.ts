import { UserService } from '../api/user.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ModalAlarmPage } from '../modal-alarm/modal-alarm.page';
import { ModalLabPage } from '../modal-lab/modal-lab.page';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataReturned:any;
  name_head: any;
  date_head: any;

  constructor(
    public US: UserService,
    private datePipe: DatePipe,
    public modalController: ModalController
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

  
  clickonmenu(){
    console.log('clickonmenu');
  }

  async openModal() {
    
    const modal = await this.modalController.create({
      component: ModalAlarmPage,
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

  async openModal2() {
    const modal2 = await this.modalController.create({
      component: ModalLabPage,
      cssClass: 'modalCss'
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
