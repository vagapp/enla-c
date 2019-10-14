import { Component, OnInit } from '@angular/core';
import { ModalController , NavParams} from '@ionic/angular';
import { AlarmasService } from '../api/alarmas.service';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-alarm-config',
  templateUrl: './modal-alarm-config.page.html',
  styleUrls: ['./modal-alarm-config.page.scss'],
})
export class ModalAlarmConfigPage implements OnInit {

  selectedDate:any;
  timezone:number;
  hourAlarm:string;
  node:any;
  /*PARAMETROS ENVIADOS DE LA VISTA PADRE*/
  hora_param: string =this.nav.get('hora_param');
  formato_param: string = this.nav.get('formato_param');
  status_param: boolean = false;
  nid_param:number = this.nav.get("nid_param"); 
  isUpdated:boolean = false;
  isnew_param : boolean = this.nav.get("isnew_param"); 
  /*PARAMETROS ENVIADOS DE LA VISTA PADRE*/
  constructor(
    public modalController: ModalController,
    public global: GlobalsService,
    public co: CommonService,
    public nav : NavParams,
    public alarmserv : AlarmasService
  ) { }
    
  ngOnInit() {
    if(!this.isnew_param){
      this.selectedDate = new Date();
      this.selectedDate.setHours(this.hora_param.substr(0,2), this.hora_param.substr(3,5));
      this.selectedDate = this.selectedDate.toISOString();
      this.status_param = this.nav.get('status_param');
    }
  }

  async closeModal(){
    if(this.isUpdated){
      await this.modalController.dismiss(this.node);
    }else{
      await this.modalController.dismiss(undefined);
    }
    
  }

  crearAlarma(){
    if(!this.isnew_param){
      this.global.showLoader();
      this.alarmserv.actualizaAlarma(undefined,this.nid_param, this.hourAlarm).subscribe(result =>{
        this.node = result;
        this.global.hideLoader();
        this.co.presentAlert('Alarma', '', "Se guardo exitosamente");
        this.isUpdated = true;
        },(err:HttpErrorResponse) => {
          this.global.hideLoader();
          this.co.presentAlert('Error','Ocurrio un error al registrar tu alarma.', err.error.message);
        }
      );
    }else{
      this.global.showLoader();
      this.alarmserv.creaAlarma(this.hourAlarm, this.timezone).subscribe(result =>{
        this.node = result;
        this.global.hideLoader();
        this.co.presentAlert('Alarma', '', "Se creo correctamente la alarma");
        this.isUpdated = true;
        },(err:HttpErrorResponse) => {
          this.global.hideLoader();
          this.co.presentAlert('Error','Ocurrio un error al registrar tu alarma.', err.error.message);
        }
      );
    } 
  }

  parseDate(){
    let date = new Date(this.selectedDate);
    this.timezone = date.getTimezoneOffset();
    let datetext = date.toTimeString();
    datetext = datetext.split(' ')[0];
    this.hourAlarm = datetext.substring(0,5);
  }
}