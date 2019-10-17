import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { GlobalsService } from '../api/globals.service';
import { PruebasService } from '../api/pruebas.service';
import { CommonService } from '../app/common.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-lab',
  templateUrl: './modal-lab.page.html',
  styleUrls: ['./modal-lab.page.scss'],
})
export class ModalLabPage implements OnInit {

  fecha_param: any =this.nav.get('fecha_param');
  status_param:any = false;
  nidProximaPrueba_param:any;
  puedeMarcarPrueba_param:boolean=false;
  statusPrueba_param:boolean=false

  constructor(
    private modalController: ModalController,
    public router: Router,
    public nav : NavParams,
    private global: GlobalsService,
    private pruebasServ : PruebasService,
    public co: CommonService,
    public toastController:ToastController
  ) { 



  }

  ngOnInit() {
  }

  async closeModal() {
    //const onClosedData: string = "Wrapped Up!";
    const onClosedData: boolean = this.status_param;
    await this.modalController.dismiss(onClosedData);
  }

  async closeModalNo() {
    const onClosedData: string = "Wrapped Up!";
    //const onClosedData: boolean = this.status_param;
    await this.modalController.dismiss(onClosedData);
  }

  navegar(url){
    this.closeModal();
    this.router.navigateByUrl(url);
  }

  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  enableDisable(nid:number,status:boolean){
    this.global.showLoader();
     this.pruebasServ.updatePruebasMed(undefined, nid, status).subscribe(result =>{
        //console.log(result);  
        this.global.hideLoader();
        this.status_param = result['field_status_pruebamed'][0].value;
        this.closeModal();
        //this.status_param = result;
        if(this.status_param){
          this.presentToast("Se marcó exitosamente la prueba");
        }else{
          this.presentToast("Se desmarco exitosamente la prueba");
        }
        
     },(err:HttpErrorResponse) => {
       this.global.hideLoader();
       this.co.presentAlert('Error','Ocurrio un error al recuperar tu alarma.', err.error.message);
     })
   }

}
