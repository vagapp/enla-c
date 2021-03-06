import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GlobalsService } from '../api/globals.service';
import { CommonService } from '../app/common.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})


export class ConfiguracionPage implements OnInit {

  update_data = new FormGroup({
    name: new FormControl(null,Validators.required),
    apellidos: new FormControl(null,Validators.required),
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
    fecha_fin: new FormControl(null,Validators.required)
  });

  sexosData: any;
  institutoData: any;
  sexo: any;angular
  institucion: any;
  name_head: any;
  date_head: any;
  in_name: any;
  in_apellidos: any;
  in_mail: any;
  in_fecha_nacimiento: any;
  in_cp: any;
  in_municipio: any;
  in_estado: any;
  in_fecha_inicio: any;
  in_fecha_fin: any;
  initload: boolean = true;  

  constructor(
    private US: UserService,
    private datePipe: DatePipe,
    public global: GlobalsService,
    public co: CommonService,
    private cdRef:ChangeDetectorRef
  ) { }

  ngOnInit() {
    

    this.US.loadinsti().subscribe(
      res => { 
        console.log("1");
        this.institutoData = res;
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
    
    this.US.loadsexos().subscribe(
      resS => { 
        console.log("2");
        this.sexosData = resS;
        this.loadInformation();
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );


    

    
  }

  loadInformation(){
    this.initload = true;
    this.US.getLoginStatus().subscribe(
      res => { 
        console.log("3");
        console.log(res.current_user);
        this.in_name             = res.current_user.fullname;
        this.in_apellidos        = res.current_user.apellidos;
        this.in_mail             = res.current_user.email;
        this.in_fecha_nacimiento = res.current_user.fecha_nacimiento;
        this.in_cp               = res.current_user.codigo_postal;
        this.in_fecha_inicio     = res.current_user.fecha_inicio_tratamiento;
        this.in_fecha_fin        = res.current_user.fecha_fin_tratamiento;
        this.sexo                = res.current_user.sexo['tid'];
        this.institucion         = res.current_user.institucion['tid'];
        this.searchCP(this.in_cp);
        this.initload = false;
      },
      (err: HttpErrorResponse) => { 
        this.initload = false;
        console.log(err);
      }
    );
  }


  searchCP(valor){
    console.log(valor);
    this.US.loadcps(valor).subscribe(
      res => {
        console.log(res[0]);
        this.in_municipio = (res[0]) ? res[0].D_mnpio : '';
        this.in_estado    = (res[0]) ? res[0].d_estado : '';
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }


  async updData(form) {
    const alert = await this.co.alertController.create({
      header: 'CONTRASEÑA ACTUAL',
      subHeader: '',
      message: 'Por favor ingrese su contraseña actual para guardar los cambios',
      inputs: [
        {
          name: 'currentPassword',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Actualizar',
          handler: data => {

            var values = form;
            
            var currentPassword = data.currentPassword;
            var bandera = true;
            var banderaPass = false;

            if((values.name != null && values.name != '') && 
              (values.apellidos != null && values.apellidos != '') &&
              (values.mail != null && values.mail != '') && 
              (values.fecha_nacimiento != null && values.fecha_nacimiento != '') && 
              (values.fecha_inicio != null && values.fecha_inicio != '') && 
              (values.fecha_fin != null && values.fecha_fin != '') && 
              (values.institucion != null && values.institucion != '') && 
              (values.sexo != null && values.sexo != '') &&
              (values.cp != null && values.cp != '')){
              bandera = true;       
              if(!this.validateFechas(values.fecha_inicio,values.fecha_fin)){
              if(this.isEmail(values.mail)){
                
                bandera = true;
                if((values.pass != null && values.pass != '') || (values.pass1 != null && values.pass1 != '')){
                  if(values.pass == values.pass1){
                    bandera = true;
                    banderaPass = true;
                  }else{
                    bandera = false;
                    this.co.presentAlert('Error','','Las contraseñas deben coincidir');
                  }
                }

                if(bandera){
                  this.global.showLoader();
                  
                  var news = {'mail': values.mail,
                              'field_fecha_de_nacimiento': this.datePipe.transform(values.fecha_nacimiento, 'yyyy-MM-dd'),
                              'field_inicio_del_tratamiento': this.datePipe.transform(values.fecha_inicio, 'yyyy-MM-dd'),
                              'field_fin_del_tratamiento': this.datePipe.transform(values.fecha_fin, 'yyyy-MM-dd'),
                              'field_institucion': values.institucion,
                              'field_nombre_completo': values.name,
                              'field_apellidos': values.apellidos,
                              'field_codigo_postal': values.cp,
                              'currentPassword': currentPassword,
                              'field_sexo': values.sexo,
                              'password': values.pass};

                  this.US.updateUserData(news,banderaPass).subscribe(
                    res => { 
                      console.log(res);
                      this.global.hideLoader();
                      this.co.setRoot('/home');
                    },
                    (err: HttpErrorResponse) => { 
                      console.log(err);
                      this.co.presentAlert('Error','','Ocurrió un error inesperado, intenta más tarde');
                      this.global.hideLoader();
                    }
                  );
                }
              }else{
                bandera = false;
                this.co.presentAlert('Error','','Ingrese un email valido');
              }
              }else{
                this.co.presentAlert('Error','','La fecha de fin de tratamiento debe ser después de la fecha de inicio');
              }
            }else{
              bandera = false;
              this.co.presentAlert('Error','','Favor de completar todos los campos');
            }
          }
        }
      ]
    });

    await alert.present();
  }


  isEmail(search:string):boolean{
    var  serchfind:boolean;

    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    serchfind = regexp.test(search);

    console.log(serchfind)
    return serchfind
  }

  validateFechas(inicio,fin):boolean{
    let first = new Date(inicio);
    let second = new Date(fin);
    let full = Math.round((second.getTime()-first.getTime())/(1000*60*60*24));
    console.log('full is',full);
    return full <= 0;
  }

  saverange(){
    console.log('saverange',this.initload);
    if(!this.initload){
    this.in_fecha_fin = this.US.calcularSemanas(this.in_fecha_inicio);
    this.cdRef.detectChanges();
    }
  }

 


}
