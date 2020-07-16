import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PruebasPage } from './pruebas.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: PruebasPage
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
  declarations: [PruebasPage]
})
export class PruebasPageModule {}
