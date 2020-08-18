import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
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
  activoSi: boolean;
  activoNo: boolean;
  nid: any;
  home: boolean;
  isToday: boolean;

  constructor(
    private modalController: ModalController,
    public router: Router,
    private US: UserService,
    private global: GlobalsService,
    private co: CommonService,
    private datePipe: DatePipe,
    public toastController :ToastController
  ) { }

  ngOnInit() {
    
    const modalElement = document.querySelector('ion-modal');
    this.dateParam = modalElement.componentProps.Paramdate;
    this.nid = modalElement.componentProps.nid;
    this.activoSi = (modalElement.componentProps.activo) ? false : true;
    this.activoNo = (modalElement.componentProps.activo) ? true : false;
    this.home = modalElement.componentProps.home;
    this.isToday = modalElement.componentProps.today;
    
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
    console.log('fecha',fecha);
    this.global.showLoader();
    fecha = this.datePipe.transform(fecha,'yyyy-MM-dd');
    console.log('fecha tramsformada',fecha);
    this.US.registerdosis(this.US.account.current_user.uid, fecha).subscribe(
      res => { 
        if(this.isToday)
          this.US.dosisdia = true;
        if(this.home && this.isToday){
          this.US.dosisdia = true;
        }
          
        //this.co.presentAlert('Dosis Registrada','','Tu dosis del día ha quedado registrada, ¡Sigue así!');
        this.presentToast("Tu dosis del día ha quedado registrada, ¡Sigue así!");
        this.closeModal();
        this.global.hideLoader();
        // this.co.setRoot('/login');
      },
      (err: HttpErrorResponse) => { 
        this.co.presentAlert('Error','','Ocurrió un error inesperado, intenta más tarde');
        this.global.hideLoader();
      }
    );
  }

  removeAlarm(nid){
    this.global.showLoader();
    this.US.removedosis(nid).subscribe(
      res => {

        if(this.isToday){
          this.US.dosisdia = false;
        }
        
        if(this.home && this.isToday){
          this.US.dosisdia = false;
        }
        
          
        
        //this.co.presentAlert('Registro Eliminado','','Hemos eliminado el registro exitosamente.');
        this.presentToast("Hemos eliminado el registro exitosamente.");
        this.closeModal();
        this.global.hideLoader();
        // this.co.setRoot('/login');
      },
      (err: HttpErrorResponse) => { 
        this.co.presentAlert('Error','','Ocurrió un error inesperado, intenta más tarde');
        this.global.hideLoader();
      }
    );
  }

  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      cssClass: "toast-success",
    });
    toast.present();
  }

}