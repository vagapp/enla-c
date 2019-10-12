import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ModalAlarmPage } from '../modal-alarm/modal-alarm.page';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-dosis',
  templateUrl: './dosis.page.html',
  styleUrls: ['./dosis.page.scss'],
})
export class DosisPage implements OnInit {
  
  name_head: any;
  date_head: any;
  todayS: any;
  dataReturned:any;
  date: string[];
  options: CalendarComponentOptions = {
    from: new Date(2019, 0, 1),
    pickMode: 'multi'    
  };
  
  

  constructor(
    private US: UserService,
    private datePipe: DatePipe,
    public modalController: ModalController,
    private global: GlobalsService,
    private co: CommonService
  ) { }

  ngOnInit() {
    
    //this.date = ['2018-01-01', '2018-01-02', '2018-01-05']
    

    var today = new Date();
    
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.todayS = mm + '/' + dd + '/' + yyyy;

    this.US.getLoginStatus().subscribe(
      res => { 
        this.name_head = res.current_user.fullname;
        this.date_head = this.datePipe.transform(res.current_user.fecha_inicio_tratamiento,'dd-MM-yyyy');
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
    
    this.US.loaddosis().subscribe(
      resS => {
        var fechasData = new Array(); 
        var count = Object.keys(resS).length;
        
        for(var i=0; i<count; i++){
          var fecha = this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd');
          fechasData.push(fecha);
        }
        
        this.date = fechasData;
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );

  }

  onChange($event){
    console.log($event);
    var dateSel = $event[$event.length-1];
    this.openModal(dateSel);

  }

  async openModal(Paramdate) {
    
    const modal = await this.modalController.create({
      component: ModalAlarmPage,
      cssClass: 'modalCss',
      componentProps: {'Paramdate': Paramdate}
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
 
    return await modal.present();
  }
/*
this.US.registerdosis("hola", "adios").subscribe(
      res => { 
        console.log(res);
        this.global.hideLoader();
        this.co.setRoot('/login');
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
        this.co.presentAlert('Error','','Ocurrió un error inesperado, intenta más tarde');
        this.global.hideLoader();
      }
    );
*/

}
