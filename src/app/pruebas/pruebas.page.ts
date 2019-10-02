import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertPage } from '../alert/alert.page';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  dataReturned:any;

  constructor(
    public modalController: ModalController
  ) {}

  ngOnInit() {
  }

  async openModal3() {
    const modal = await this.modalController.create({
      component: AlertPage,
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
}
