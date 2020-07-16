import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AprendePage } from './aprende.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: AprendePage
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
  declarations: [AprendePage]
})
export class AprendePageModule {}
