import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { QuranPage } from './quran.page';

const routes: Routes = [{ path: '', component: QuranPage }];

@NgModule({
  declarations: [QuranPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class QuranPageModule {}