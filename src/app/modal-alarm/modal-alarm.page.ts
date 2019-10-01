import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-alarm',
  templateUrl: './modal-alarm.page.html',
  styleUrls: ['./modal-alarm.page.scss'],
})
export class ModalAlarmPage implements OnInit {

  constructor(
    private modalController: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  navegar(url){
    this.closeModal();
    this.router.navigateByUrl(url);
  }
}