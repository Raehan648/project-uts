import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { QuranDetailPage } from './quran-detail.page';

const routes: Routes = [{ path: '', component: QuranDetailPage }];

@NgModule({
  declarations: [QuranDetailPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class QuranDetailPageModule {}