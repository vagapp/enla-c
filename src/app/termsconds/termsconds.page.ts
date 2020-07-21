import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { ModalController } from '@ionic/angular';
import { GlobalsService } from '../api/globals.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../app/common.service';

@Component({
  selector: 'app-termsconds',
  templateUrl: './termsconds.page.html',
  styleUrls: ['./termsconds.page.scss'],
})
export class TermscondsPage implements OnInit {
  contenido:string = '';
  constructor(
    public US: UserService,
    public global: GlobalsService,
    private modalController: ModalController,
    public co: CommonService
  ) { }

  ngOnInit() {
    this.global.showLoader();
    this.US.termsCond().subscribe(
      (res:any) => {
        this.global.hideLoader();
        this.contenido = res.body[0].value;
      },(err:HttpErrorResponse) => {
        this.global.hideLoader();
        this.co.presentAlert('Error','Ocurrio un error la pagina.', err.error.message);
      });
    
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
