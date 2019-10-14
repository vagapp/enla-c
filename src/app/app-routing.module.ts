import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'aprende', loadChildren: './aprende/aprende.module#AprendePageModule' },
  { path: 'encuentra', loadChildren: './encuentra/encuentra.module#EncuentraPageModule' },
  { path: 'pruebas', loadChildren: './pruebas/pruebas.module#PruebasPageModule' },
  { path: 'alert', loadChildren: './alert/alert.module#AlertPageModule' },
  { path: 'dosis', loadChildren: './dosis/dosis.module#DosisPageModule' },
  { path: 'alarma', loadChildren: './alarma/alarma.module#AlarmaPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'modal-alarm', loadChildren: './modal-alarm/modal-alarm.module#ModalAlarmPageModule' },
  { path: 'modal-lab', loadChildren: './modal-lab/modal-lab.module#ModalLabPageModule' },
  { path: 'configuracion', loadChildren: './configuracion/configuracion.module#ConfiguracionPageModule' },
  { path: 'modal-alarm-config', loadChildren: './modal-alarm-config/modal-alarm-config.module#ModalAlarmConfigPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
