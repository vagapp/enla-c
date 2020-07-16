import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { DosisPage } from './dosis.page';
import { ComponentsModule } from '../components.module';
//imports: [];
const routes: Routes = [
  {
    path: '',
    component: DosisPage
  }
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DosisPage]
})
export class DosisPageModule {}
