import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
//import { NotificacionesPage } from '../notificaciones/notificaciones.page'

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router, public alertController: AlertController,private menuCtrl: MenuController, public modalController: ModalController, public navCtrl: NavController) { }

  goToHome(){
    this.router.navigateByUrl("/inicio");
  }

  go(route:string) {
    this.router.navigateByUrl(route);
  }
  setRoot(route:string){
    this.navCtrl.navigateRoot(route);
  }
  async presentAlert(HEADER,SUBHEADER,MESSAGE) {
    const alert = await this.alertController.create({
      header: HEADER,
      subHeader: SUBHEADER,
      message: MESSAGE,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  openMenu(){
    this.menuCtrl.toggle();
  }

  /*async openNotis(){
    const modal = await this.modalController.create({
      component: NotificacionesPage
    });
    return await modal.present();
  }*/
}
