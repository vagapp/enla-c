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
    console.log("nid " + this.nid_param);
    console.log("fecha" + new Date(this.fecha_param));
  }

  calculateReminder(){
    this.fecha_reminder = new Date(this.fecha_param);
    this.fecha_reminder.setHours(this.fecha_reminder.getHours() - this.horasSelect);
    this.fecha_reminder = this.fecha_reminder.getTime();
//    console.log("final "+ this.fecha_reminder)
  }

  saveReminder(){
    this.global.showLoader();
    console.log("Seleccionado " + this.horasSelect ); 
    this.pruebasServ.updateHorasReminer(this.fecha_reminder.toString(), parseInt(this.nid_param)).subscribe(result =>{
      this.global.hideLoader();
      this.closeModal();
      this.presentToast("Se marcó exitosamente la prueba");
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
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }
}
