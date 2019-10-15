import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ClickOutsideModule } from 'ng-click-outside';

import { ModalAlarmPageModule } from './modal-alarm/modal-alarm.module';
import { ModalLabPageModule } from './modal-lab/modal-lab.module';
import { ModalAlarmConfigPageModule } from './modal-alarm-config/modal-alarm-config.module';
import { TermscondsPageModule } from './termsconds/termsconds.module';
import { AlertPageModule } from './alert/alert.module';
import { HttpClientModule } from '@angular/common/http';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios',
    }),
    AppRoutingModule,
    ClickOutsideModule,
    ModalAlarmPageModule,
    ModalLabPageModule,
    ModalAlarmConfigPageModule,
    TermscondsPageModule,
    AlertPageModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    DocumentViewer,
    FileTransfer,
    File,
    FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


