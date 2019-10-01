import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalAlarmPage } from '../modal-alarm/modal-alarm.page';
import { ModalLabPage } from '../modal-lab/modal-lab.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataReturned:any;

  constructor(
    public modalController: ModalController
  ) {}

  clickonmenu(){
    console.log('clickonmenu');
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

  async openModal2() {
    const modal2 = await this.modalController.create({
      component: ModalLabPage,
      cssClass: 'modalCss'
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
