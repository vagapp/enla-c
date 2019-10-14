import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalAlarmConfigPage } from './modal-alarm-config.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAlarmConfigPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalAlarmConfigPage]
})
export class ModalAlarmConfigPageModule {}
