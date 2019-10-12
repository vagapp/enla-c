import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertPage } from '../alert/alert.page';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { PruebasService } from '../api/pruebas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  dataReturned:any;
  anyClinica:boolean = false;
  pruebasLista:any;
  ultimaPrueba:any;
  selectedDate:any;
  nidProximaPrueba:number;
  isNew:boolean=true;
  
  constructor(
    public modalController: ModalController,
    public global: GlobalsService,
    public pruebasServ : PruebasService,
    public toastController: ToastController,
    public co: CommonService
  ) {}

  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit(){
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

  recuperaPruebaHoy(pruebas:any){
    let fechaUltimaPrueba = new Date(parseInt(pruebas[0].field_fecha_prueba[0].value));
    let hoy = new Date();
    if(fechaUltimaPrueba >= hoy ){
      this.isNew = false;
      this.nidProximaPrueba = pruebas[0].nid[0].value;
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
        fecha_param:this.selectedDate
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
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
      this.isNew=false;
      this.ultimaPrueba = result;
      this.presentToast("Se creo exitosamente la prueba");
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
      this.presentToast("Se actualizó exitosamente la prueba");
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
      this.presentToast("Se marcó exitosamente la prueba");
    },(err:HttpErrorResponse) => {
      this.global.hideLoader();
      this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
    })
  }

}
