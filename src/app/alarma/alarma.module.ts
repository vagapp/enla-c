import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlarmaPage } from './alarma.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: AlarmaPage
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
  declarations: [AlarmaPage]
})
export class AlarmaPageModule {}
