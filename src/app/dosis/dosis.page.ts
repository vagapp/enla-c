import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ModalAlarmPage } from '../modal-alarm/modal-alarm.page';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';

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
  options: CalendarComponentOptions;
  dates: Date[];
  datesOrigin: string[];
  numId: any;

  constructor(
    private US: UserService,
    private datePipe: DatePipe,
    public modalController: ModalController,
    private global: GlobalsService,
    private co: CommonService
  ) { 
    this.dates = [];
    this.datesOrigin = [];
  }

  ngOnInit() {
    
    

    this.US.getLoginStatus().subscribe(
      res => { 
        //console.log(res);
        this.name_head = res.current_user.fullname;
        //this.datePipe.transform()
        this.date_head = this.datePipe.transform(res.current_user.fecha_inicio_tratamiento,'dd-MM-yyyy','+0000');
        
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );

    
    this.loadDates();

    

  }

  loadDates(){

    var today = new Date();
    this.datesOrigin = [];
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.todayS = dd + '/' + mm + '/' + yyyy;


    this.US.loaddosis().subscribe(
      resS => {
        console.log(resS);
        //this.datesOrigin = resS;
        const daysConfig: DayConfig[] = [];
        
        var count = Object.keys(resS).length;

        var noDosis = this.getDates(new Date(this.US.account.current_user.fecha_inicio_tratamiento), new Date(today));
        
        for(var j=0; j<noDosis.length; j++){
          for(var i=0; i<count; i++){
            var clase = 'my-day-no'
            this.datesOrigin.push(this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd'));
            if(this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd') == this.datePipe.transform(noDosis[j], 'yyyy-MM-dd')){
              var fecha = new Date(this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd','GMT+1500'));
              clase = 'my-day nid_'+resS[i].nid;
            }else{
              var fecha = new Date(this.datePipe.transform(noDosis[j], 'yyyy-MM-dd'))
              clase = 'my-day-no';
            }
             
            daysConfig.push({
              date: fecha,
              cssClass: clase
            });
          }
        }
        this.options = {
          daysConfig,
          from: new Date(this.datePipe.transform(this.US.account.current_user.fecha_inicio_tratamiento, 'yyyy-MM-dd','GMT+1500')),
        };
        
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }



  getDates(startDate: Date, endDate: Date) { 
    let currentDate: Date = startDate;
    
    while (currentDate <= endDate) { 
        this.dates.push(currentDate);
        currentDate = this.addDays(currentDate);
    }
    return this.dates;
  }

  private addDays(currentDate) { 
    let date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    return date;
  }

  onEventSelected($event){
    var classId = $event.cssClass;
    classId = classId.replace(/ /g, "");
    if(classId.length>9){
      classId = classId.replace("my-daynid_", '');
    }else{
      classId = 0;
    }
    this.numId = classId;
  }


  onChange($event){
    console.log($event);
    var bandera = false;
    bandera = Object.keys(this.datesOrigin).some(key => this.datesOrigin[key] == $event);
    //console.log(bandera);
    var dateSel = $event;
    this.openModal(dateSel, bandera, this.numId);

  }

  async openModal(Paramdate, bandera, classId) {
    
    const modal = await this.modalController.create({
      component: ModalAlarmPage,
      cssClass: 'modalCss',
      componentProps: {'Paramdate': Paramdate,'activo':bandera, 'nid': classId, 'home': false}
    });
 
    modal.onDidDismiss().then((dataReturned) => {
    
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
      this.loadDates();
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
