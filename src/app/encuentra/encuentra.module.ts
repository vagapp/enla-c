import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EncuentraPage } from './encuentra.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: EncuentraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EncuentraPage]
})
export class EncuentraPageModule {}
