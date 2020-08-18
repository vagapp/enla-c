import { Component, OnInit, ɵConsole } from '@angular/core';
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
  date_head_fin: any;
  date_head_percent: any;
  todayS: any;
  todayF: any;
  dataReturned:any;
  date: string[];
  options: CalendarComponentOptions;
  dates: Date[];
  datesOrigin: string[];
  numId: any;
  nid: any;
  ndose: number = 0;

  constructor(
    public US: UserService,
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
        this.date_head = this.datePipe.transform(res.current_user.fecha_inicio_tratamiento,'dd-MM-yyyy');
        this.date_head_fin = this.datePipe.transform(res.current_user.fecha_fin_tratamiento,'dd-MM-yyyy');
        let first = new Date(res.current_user.fecha_inicio_tratamiento);
        let second = new Date(res.current_user.fecha_fin_tratamiento);
        /*let today = new Date();
        let full = Math.round((second.getTime()-first.getTime())/(1000*60*60*24));
        let progress = Math.round((today.getTime()-first.getTime())/(1000*60*60*24));
        this.date_head_percent = Math.ceil((100 * progress) / full);
        console.log(this.date_head_percent);*/
        this.date_head_percent = 0;
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
    this.todayF = yyyy + '-' + mm + '-' + dd;


    this.US.loaddosis().subscribe(
      resS => {
        console.log('loaddosis res',resS);
        const daysConfig: DayConfig[] = [];
        var count = Object.keys(resS).length;
        var noDosis = this.getDates(new Date(this.US.account.current_user.fecha_inicio_tratamiento), new Date(today));
        this.date_head_percent =  Math.round((100 * count) / UserService.duracion_tratamiendo * 10) / 10 ;
        for(var j=0; j<noDosis.length; j++){
          var fecha = this.datePipe.transform(noDosis[j], 'yyyy-MM-dd');
          var clase = 'my-day-no';
          for(var i=0; i<count; i++){
            this.datesOrigin.push(this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd'));
            if(this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd') == this.datePipe.transform(noDosis[j], 'yyyy-MM-dd')){
              fecha = this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd');
              console.log('date enter condition',this.datePipe.transform(resS[i].field_fecha_de_dosis, 'yyyy-MM-dd'));
              clase = 'my-day nid_'+resS[i].nid;
              this.nid = resS[i].nid;
              this.ndose++;
            }
          }
          daysConfig.push({
            date: new Date(fecha+'T23:50:50'),
            cssClass: clase
          });
        }
        console.log('todayF',this.todayF);
        this.options = {
          
          daysConfig,
          from: new Date(this.US.account.current_user.fecha_inicio_tratamiento),
          to: new Date(this.todayF+'T23:50:50')
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
    console.log('eventselected',$event);
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
    var isToday = (this.todayF == dateSel) ? true : false;
    console.log(isToday);
    this.openModal(dateSel, bandera, this.numId, isToday, false);

  }

  async openModal(Paramdate, bandera, classId, isToday, ishome) {
    console.log('openmodal',Paramdate);
    const modal = await this.modalController.create({
      component: ModalAlarmPage,
      cssClass: 'modalCss',
      componentProps: {'Paramdate': Paramdate,'activo':bandera, 'nid': classId, 'home': ishome, 'today': isToday}
    });
 
    modal.onDidDismiss().then((dataReturned) => {
    
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
      this.loadDates();
    });
 
    return await modal.present();
  }

  imgModal(){
    var bandera = false;
    bandera = Object.keys(this.datesOrigin).some(key => this.datesOrigin[key] == this.todayF);
    console.log(bandera);
    var isToday = true;
    this.openModal(this.todayF, bandera, this.nid, isToday, true);
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
