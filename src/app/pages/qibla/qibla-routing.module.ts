import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QiblaPage } from './qibla.page';

const routes: Routes = [
  {
    path: '',
    component: QiblaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QiblaPageRoutingModule {}
