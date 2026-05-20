import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SettingsPage } from './settings.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: SettingsPage }];

@NgModule({
  declarations: [SettingsPage],
  imports: [SharedModule, RouterModule.forChild(routes), FormsModule],
})
export class SettingsPageModule {}