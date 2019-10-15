import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-termsconds',
  templateUrl: './termsconds.page.html',
  styleUrls: ['./termsconds.page.scss'],
})
export class TermscondsPage implements OnInit {
  contenido:string = '';
  constructor(
    public US: UserService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.US.termsCond().subscribe(
      (res:any) => {
        this.contenido = res.body[0].value;
      }
    );
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
