import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from '../api/globals.service';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
//import { File } from '@ionic-native/file';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as he from 'he';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-aprende',
  templateUrl: './aprende.page.html',
  styleUrls: ['./aprende.page.scss'],
})
export class AprendePage implements OnInit {

  articleData: any;
  article: any;
  name_head: any;
  date_head: any;
  constructor(
    private US: UserService,
    private datePipe: DatePipe,
    private http: HttpClient,
    public global: GlobalsService,
    private document: DocumentViewer,
    private transfer: FileTransfer,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener
  ) {   }
  
  

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



    this.US.loadarticles().subscribe(
      res => { 
        var count = Object.keys(res).length;
        
        for(var i=0; i<count; i++){
          var imagen = he.decode(res[i].field_image.substring(1));
          var pdf    = res[i].field_pdf.substring(1);
          res[i].field_image = this.global.API+imagen;
          res[i].field_pdf = this.global.API+pdf;
        }
        
        this.articleData = res;
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
      }
    );
  }

  openPDF(url){
    
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.global.showLoader();
    
    var ruta = this.platform.is('android') ? this.file.externalDataDirectory : this.file.dataDirectory;
    fileTransfer.download(url, ruta + 'cuaderno de ejercicios'+'.pdf').then((entry) => {
      this.global.hideLoader();
      if(this.platform.is('android')){
        this.fileOpener.showOpenWithDialog(entry.toURL(), 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
      }else{
        // Use Document viewer for iOS for a better UI
        const options: DocumentViewerOptions = {
          title: 'cuaderno de ejercicios',
          documentView: {
            closeLabel: 'Cerrar'
          },
          navigationView: {
            closeLabel: 'Cerrar'
          },
          email: {
            enabled: true
          },
          print: {
            enabled: true
          },
          openWith: {
            enabled: true
          },
          bookmarks: {
            enabled: false
          },
          search: {
            enabled: false
          },
          autoClose: {
            onPause: false
          }
        }
        this.document.viewDocument(entry.toURL(), 'application/pdf', options);
      }
      //this.co.presentAlert('Programas','Su cuadernillo se descargó correctamente en: ',entry.toURL());
    }, (error) => {
      this.global.hideLoader();
      //this.co.presentAlert('Programas','Hubo un error al descargar su cuadernillo',error);
    });
    // console.log(url);
    // const options: DocumentViewerOptions = {
    //   title: 'My PDF'
    // }
    // this.document.viewDocument(url, 'application/pdf', options)
  }

}
