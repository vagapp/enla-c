import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
//import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-encuentra',
  templateUrl: './encuentra.page.html',
  styleUrls: ['./encuentra.page.scss'],
})
export class EncuentraPage implements OnInit {

  name_head: any;
  date_head: any;
  clinicData: any;
  clinic: any;

  constructor(
    private US: UserService,
    private datePipe: DatePipe,
    private DomSanitizer: DomSanitizer
  ) {
    
   }

  ngOnInit() {
    this.US.getLoginStatus().subscribe(
      res => { 
        this.name_head = res.current_user.fullname;
        this.date_head = this.datePipe.transform(res.current_user.fecha_inicio_tratamiento,'dd-MM-yyyy');
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );


    this.US.loadclinic(7,11410).subscribe(
      res => { 
      
        var count = Object.keys(res).length;
        
        for(var i=0; i<count; i++){
          var telefono = (res[i].telefono != null) ? 'Tel: '+ res[i].telefono : '';
          res[i].telefono = telefono;
        }
        
        this.clinicData = res;
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );

  }

}
