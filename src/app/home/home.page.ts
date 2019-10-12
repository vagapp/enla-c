import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalsService } from '../api/globals.service';
import { ModalAlarmPage } from '../modal-alarm/modal-alarm.page';
import { ModalLabPage } from '../modal-lab/modal-lab.page';
import { PruebasService } from '../api/pruebas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../app/common.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataReturned:any;
  selectedDate:any;
  puedeMarcarPrueba:boolean=false;
  statusPrueba:boolean = false;
  nidProximaPrueba:any;
  constructor(
    public modalController: ModalController,
    public pruebasServ : PruebasService,
    public global: GlobalsService,
    public co: CommonService,
    public toastController: ToastController
  ) {}

  ngOnInit(){
    this.global.showLoader();
    this.pruebasServ.getPruebasMed().subscribe(result =>{
      this.global.hideLoader();
      if(result.length > 0){
        console.log("pruebas lista",result);
        this.selectedDate = this.recuperaPruebaHoy(result);
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
      console.log("mensaje");
      //this.isNew = false;
      this.nidProximaPrueba = pruebas[0].nid[0].value;
      this.puedeMarcarPrueba=false;
      this.statusPrueba = pruebas[0].field_status_pruebamed[0].value; 
      return fechaUltimaPrueba.toISOString();
    }else{
      this.puedeMarcarPrueba=true;
      return undefined;
    } 
  }

  enableDisable(nid:number,status:boolean){
    this.global.showLoader();
     this.pruebasServ.updatePruebasMed(undefined, nid, status).subscribe(result =>{
       this.global.hideLoader();
       //this.pruebasLista[index] = result;
       this.presentToast("Se marcó exitosamente la prueba");
     },(err:HttpErrorResponse) => {
       this.global.hideLoader();
       this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
     })
   }



  clickonmenu(){
    console.log('clickonmenu');
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

  marcarPrueba(status:boolean){
    console.log("se puede?"+this.puedeMarcarPrueba);
    if(this.puedeMarcarPrueba){
      console.log("guadamesta");
      this.enableDisable(this.nidProximaPrueba,status);
    }else{
      this.openModal2();
    } 
  }

  async openModal2() {
    
    const modal2 = await this.modalController.create({
      component: ModalLabPage,
      cssClass: 'modalCss',
      componentProps: { 
        fecha_param:this.selectedDate
      }
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
