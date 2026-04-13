import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'quran',
        loadChildren: () =>
          import('../quran/quran.module').then((m) => m.QuranPageModule),
      },
      {
        path: 'dzikir',
        loadChildren: () =>
          import('../dzikir/dzikir.module').then((m) => m.DzikirPageModule),
      },
      {
        path: 'qibla',
        loadChildren: () =>
          import('../qibla/qibla.module').then((m) => m.QiblaPageModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then((m) => m.SettingsPageModule),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [TabsPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class TabsPageModule {}