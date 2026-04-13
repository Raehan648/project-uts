import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuranDetailPage } from './quran-detail.page';

const routes: Routes = [
  {
    path: '',
    component: QuranDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuranDetailPageRoutingModule {}
