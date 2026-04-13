import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { QiblaPage } from './qibla.page';

const routes: Routes = [{ path: '', component: QiblaPage }];

@NgModule({
  declarations: [QiblaPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class QiblaPageModule {}