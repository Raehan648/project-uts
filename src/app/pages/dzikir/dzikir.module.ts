import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DzikirPage } from './dzikir.page';

const routes: Routes = [{ path: '', component: DzikirPage }];

@NgModule({
  declarations: [DzikirPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class DzikirPageModule {}