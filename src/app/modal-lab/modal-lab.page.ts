import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-lab',
  templateUrl: './modal-lab.page.html',
  styleUrls: ['./modal-lab.page.scss'],
})
export class ModalLabPage implements OnInit {

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
