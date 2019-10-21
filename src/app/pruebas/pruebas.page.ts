import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertPage } from '../alert/alert.page';
import { UserService } from '../api/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { PruebasService } from '../api/pruebas.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  dataReturned:any;
  name_head: any;
  date_head: any;
  anyClinica:boolean = false;
  pruebasLista:any;
  ultimaPrueba:any;
  selectedDate:any;
  nidProximaPrueba:number;
  reminderProxPrueba:number;
  isNew:boolean=true;
  reminder:number = 0;
  constructor(
    public modalController: ModalController,
    private US: UserService,
    private datePipe: DatePipe,
    public global: GlobalsService,
    public pruebasServ : PruebasService,
    public toastController: ToastController,
    public co: CommonService
  ) {}
  
  ngOnInit(){
    this.US.getLoginStatus().subscribe(
      res => { 
        this.name_head = res.current_user.fullname;
        this.date_head = this.datePipe.transform(res.current_user.fecha_inicio_tratamiento,'dd-MM-yyyy');
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
    this.global.showLoader();
    this.pruebasServ.getPruebasMed().subscribe(result =>{
      this.global.hideLoader();
      if(result.length > 0){
        this.pruebasLista = result;
        console.log("pruebas lista",this.pruebasLista);
        this.selectedDate = this.recuperaPruebaHoy(this.pruebasLista);
      }
      
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

  recuperaPruebaHoy(pruebas:any){
    let fechaUltimaPrueba = new Date(parseInt(pruebas[0].field_fecha_prueba[0].value));
    let hoy = new Date();

    if(fechaUltimaPrueba >= hoy ){
      this.isNew = false;
      this.nidProximaPrueba = pruebas[0].nid[0].value;
      this.reminder = pruebas[0].field_hora_reminder.length > 0 ? pruebas[0].field_hora_reminder[0].value : 0;
      this.pruebasLista.shift();
      return fechaUltimaPrueba.toISOString();
    }else{
      return undefined;
    } 
  }

  async openModal3() {
    const modal = await this.modalController.create({
      component: AlertPage,
      cssClass: 'modalCss',
      componentProps: { 
        nid_param: this.nidProximaPrueba,
        fecha_param:this.selectedDate,
        reminder_param:this.reminder
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      console.log("ay0",dataReturned.data.field_hora_reminder.length);
      if (dataReturned.data.field_hora_reminder.length > 0) {
//        this.dataReturned = dataReturned.data;
          this.reminder = dataReturned.data.field_hora_reminder[0].value;
        //alert('Modal Sent Data :'+ dataReturned);
      }else{
        this.reminder =0;
      }
    });
 
    return await modal.present();
  }

  dateChanged(){
    let date = new Date(this.selectedDate);
    let time = date.getTime();
    if(this.isNew){
      this.saveFechaPrueba(time.toString());
    }else{
      this.updateFechaPrueba(time.toString());
    }
   
  }

  parseTimeTofullDate(time:string){
    let fulldate = new Date(parseInt(time));
    return fulldate;
  }

  parseTimeToHours(time:string){
    let fulldate = new Date(parseInt(time));
    let hora = fulldate.getHours();
    let mins = fulldate.getMinutes();
    let ampm = hora >= 12 ? 'pm' : 'am';
    return hora + ":" + mins + ' ' + ampm;
  }

  saveFechaPrueba(fecha:string){
    this.global.showLoader();
    this.pruebasServ.creaPruebaMed(fecha).subscribe(result =>{
      this.global.hideLoader();
      console.log("res",result['nid'][0].value);
      this.nidProximaPrueba = result['nid'][0].value;
      this.isNew=false;
      this.ultimaPrueba = result;
      this.presentToast("Tu prueba de laboratorio ha quedado registrada, no te olvides de programar la siguiente.");
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

  updateFechaPrueba(fecha:string){
    this.global.showLoader();
    this.pruebasServ.updatePruebasMed(fecha, this.nidProximaPrueba, undefined).subscribe(result =>{
      this.global.hideLoader();
      this.ultimaPrueba = result;
      this.presentToast("Tu prueba de laboratorio ha sido actualizada, no te olvides de programar la siguiente.");
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

  enableDisable(nid:number,status:boolean, index : any){
   this.global.showLoader();
    this.pruebasServ.updatePruebasMed(undefined, nid, status).subscribe(result =>{
      this.global.hideLoader();
      this.pruebasLista[index] = result;
      if(this.pruebasLista[index].field_status_pruebamed[0].value)
        this.presentToast("Tu prueba de laboratorio ha quedado registrada, no te olvides de programar la siguiente.");
      else
        this.presentToast("Hemos eliminado el registro exitosamente");
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

}
