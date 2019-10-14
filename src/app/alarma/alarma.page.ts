import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlarmasService } from '../api/alarmas.service';
import {ModalAlarmConfigPage} from '../modal-alarm-config/modal-alarm-config.page';
import { GlobalsService } from '../api/globals.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../app/common.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-alarma',
  templateUrl: './alarma.page.html',
  styleUrls: ['./alarma.page.scss'],
})
export class AlarmaPage implements OnInit {

  horaAlarma : string= "00:00";
  format : string  = "xm";
  status:boolean = false;
  nid:number;
  isNew:boolean = false;
  constructor(
    public modalController: ModalController,
    public alarmserv : AlarmasService,
    public toastController: ToastController,
    public co: CommonService,
    public global: GlobalsService) { }

  ngOnInit() {
    this.global.showLoader();
    this.alarmserv.getAalarma().subscribe(result =>{
      this.global.hideLoader();
      if(result.length > 0){
        this.nid = result[0].nid[0].value;
        this.horaAlarma = result[0].field_hora_alarma[0].value;
        this.format = this.setAMPM(this.horaAlarma);
        this.status = result[0].field_status[0].value;
      }else{
        this.isNew = true;
      }
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.horaAlarma = "00:00";
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

  actualizaAlarma(status:boolean){
    this.global.showLoader();
    this.alarmserv.actualizaAlarma(status, this.nid, undefined).subscribe(result =>{
      this.global.hideLoader();
      this.status = result['field_status'][0].value;
      this.presentToast(status == true ? "Se activo tu alarma": "Se desactivo tu alarma");
      },(err:HttpErrorResponse) => {
        this.global.hideLoader();
        this.co.presentAlert('Error','Ocurrio un error al registrar tu alarma.', err.error.message);
      }
    );
  }

  //display AM or PM depends on the our of alarm con
  setAMPM(horaAlarma:string){
    let hora = parseInt(horaAlarma.substr(0,2));
    let ampm = hora >= 12 ? 'pm' : 'am';
    return ampm;
  }

  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalAlarmConfigPage,
      cssClass: 'modalCss',
      componentProps: { 
        hora_param: this.horaAlarma,
        formato_param: this.format,
        status_param:this.status,
        nid_param:this.nid,
        isnew_param:this.isNew
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => { 
      if(dataReturned.data != undefined){
        //console.log("DATA",dataReturned);
        this.horaAlarma = dataReturned.data.field_hora_alarma[0].value;
        this.status = dataReturned.data.field_status[0].value;
        this.format = this.setAMPM(this.horaAlarma);
      }

    });
    return await modal.present();
  }

}