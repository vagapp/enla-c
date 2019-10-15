import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { TermscondsPage } from '../termsconds/termsconds.page';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  register_data = new FormGroup({
    name: new FormControl(null,Validators.required),
    lastname: new FormControl(null,Validators.required),
    mail: new FormControl(null,Validators.required),
    pass: new FormControl(null,Validators.required),
    pass1: new FormControl(null,Validators.required),
    fecha_nacimiento: new FormControl(null,Validators.required),
    sexo: new FormControl(null,Validators.required),
    institucion: new FormControl(null,Validators.required),
    cp: new FormControl(null,Validators.required),
    estado: new FormControl(null,Validators.required),
    municipio: new FormControl(null,Validators.required),
    fecha_inicio: new FormControl(null,Validators.required),
    condiciones: new FormControl(null,Validators.required)
  });

  sexosData: any;
  institutoData: any;
  municipio: '';
  estado: '';
  aceptaBand: false;

  sexo: any;
  institucion: any;


  constructor(
    private US: UserService,
    private datePipe: DatePipe,
    public global: GlobalsService,
    public co: CommonService,
    private modalController: ModalController
  ) {  }

  ngOnInit() {

    this.US.loadsexos().subscribe(
      resS => { 
        this.sexosData = resS;
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );

    this.US.loadinsti().subscribe(
      res => { 
        this.institutoData = res;
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }
  
  register(form) {
    
    var values = form;
    console.log(values);


    if((values.name != null && values.name != '') &&
       (values.lastname != null && values.lastname != '') &&  
       (values.mail != null && values.mail != '') && 
       (values.pass != null && values.pass != '') &&
       (values.pass1 != null && values.pass1 != '') && 
       (values.fecha_nacimiento != null && values.fecha_nacimiento != '') && 
       (values.fecha_inicio != null && values.fecha_inicio != '') && 
       (values.institucion != null && values.institucion != '') && 
       (values.sexo != null && values.sexo != '') &&
       (values.cp != null && values.cp != '')){       
      if(this.isEmail(values.mail)){
        if(values.pass == values.pass1){
          if(values.condiciones != null && values.condiciones != false){
            this.global.showLoader();
            var fecha_nac = this.datePipe.transform(values.fecha_nacimiento, 'yyyy-MM-dd');
            var fecha_ini = this.datePipe.transform(values.fecha_inicio, 'yyyy-MM-dd');
            
            this.US.register(values.name, values.lastname, values.mail, values.pass, fecha_nac, fecha_ini, values.institucion, values.name, values.sexo, values.cp).subscribe(
              res => { 
                console.log(res);
                this.global.hideLoader();
                this.co.setRoot('/login');
              },
              (err: HttpErrorResponse) => { 
                console.log(err);
                this.co.presentAlert('Error','',err);
                this.global.hideLoader();
              }
            );
          }else{
            this.co.presentAlert('Error','','Debes aceptar los Términos y condiciones para poder registrarte');
            this.global.hideLoader();
          }
        }else{
          this.co.presentAlert('Error','','Las contraseñas deben coincidir');
        }
      }else{
        this.co.presentAlert('Error','','Ingrese un email valido');
      }
    }else{
      this.co.presentAlert('Error','','Favor de completar todos los campos');
    }
  }

  isEmail(search:string):boolean{
    var  serchfind:boolean;

    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    serchfind = regexp.test(search);

    console.log(serchfind)
    return serchfind
  }

  segmentChanged(ev: any) {
    this.co.setRoot('/'+ev.detail.value);
  }
  searchCP(valor){
    console.log(valor);
    this.US.loadcps(valor).subscribe(
      res => {
        console.log(res[0]);
        this.municipio = (res[0]) ? res[0].D_mnpio : '';
        this.estado    = (res[0]) ? res[0].d_estado : '';
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }
  async openTermCond(id){
    this.US.nodo = id;
    const modal = await this.modalController.create({
      component: TermscondsPage
    });
    return await modal.present();
  }
}
