import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { UserService } from '../api/user.service';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-alarm',
  templateUrl: './modal-alarm.page.html',
  styleUrls: ['./modal-alarm.page.scss'],
})
export class ModalAlarmPage implements OnInit {

  dateParam: any;
  constructor(
    private modalController: ModalController,
    public router: Router,
    private US: UserService,
    private global: GlobalsService,
    private co: CommonService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    
    const modalElement = document.querySelector('ion-modal');
    this.dateParam = modalElement.componentProps.Paramdate;
    
  }

  
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  navegar(url){
    this.closeModal();
    this.router.navigateByUrl(url);
  }

  registerAlarm(fecha){
    console.log("fecha: "+fecha);
    this.global.showLoader();
    fecha = this.datePipe.transform(fecha,'yyyy-MM-dd');
    console.log("fecha2: "+fecha);
    this.US.registerdosis(this.US.account.current_user.uid, fecha).subscribe(
      res => { 
        console.log(res);
        this.closeModal();
        this.global.hideLoader();
        // this.co.setRoot('/login');
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
        this.co.presentAlert('Error','','Ocurrió un error inesperado, intenta más tarde');
        this.global.hideLoader();
      }
    );
  }


}