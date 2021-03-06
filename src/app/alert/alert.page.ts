import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { PruebasService } from '../api/pruebas.service';
import { GlobalsService } from '../api/globals.service';
import { ToastController } from '@ionic/angular';
import { CommonService } from '../app/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {
  horasSelect:number = 1;
  nid_param: string =this.nav.get('nid_param');
  fecha_param: any =this.nav.get('fecha_param');
  fecha_reminder:any;
  reminder_param  = this.nav.get('reminder_param');
  returnData: any;
  hourOptions = [ 
    {
      id:1
    },{
      id:2
    },{
      id:3
    }
  ];
  constructor(
    private modalController: ModalController,
    public nav : NavParams,
    public router: Router,
    public toastController: ToastController,
    public global: GlobalsService,
    public pruebasServ : PruebasService,
    public co: CommonService
  ) { }

  ngOnInit() {
    console.log("reminder" + this.reminder_param);
    if(this.reminder_param != 0){
      this.selectedReminder();
    }else{

    }
      
  }

  selectedReminder(){
    let fromDate = new Date(this.fecha_param).getTime()/1000; 
    let toDate = new Date(parseInt(this.reminder_param)).getTime()/1000;
    console.log("mensaje " +  Math.abs(toDate - fromDate) / 3600); 
    this.horasSelect = Math.abs(toDate - fromDate) / 3600;
    
  }

  calculateReminder(){
    console.log("fechaparam"+this.fecha_param);
    this.fecha_reminder = new Date(this.fecha_param);
    this.fecha_reminder.setHours(this.fecha_reminder.getHours() - this.horasSelect);
    this.fecha_reminder = this.fecha_reminder.getTime();
  }

  saveReminder(){
    console.log("param"+this.fecha_reminder);
    if(this.fecha_reminder== undefined){
      this.calculateReminder();
    }
    this.global.showLoader();
    this.pruebasServ.updateHorasReminer(this.fecha_reminder.toString(), parseInt(this.nid_param)).subscribe(result =>{
      console.log("result", result);
      this.returnData = result;
      this.global.hideLoader();
      this.closeModal();
      this.presentToast("Se creo exitosamente la alarma");
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

  deleteReminder(){
    this.global.showLoader();
    this.pruebasServ.updateHorasReminer(null, parseInt(this.nid_param)).subscribe(result =>{
      console.log("result", result);
      this.returnData = result;
      this.global.hideLoader();
      this.closeModal();
      this.presentToast("Se eliminó correctamente la alarma");
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

async presentToast(mensaje:string) {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 2000
  });
  toast.present();
}
  

  async closeModal() {
    //const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(this.returnData);
  }
}
