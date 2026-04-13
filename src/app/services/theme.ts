import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme$ = new BehaviorSubject<Theme>('dark');

  constructor(private storage: StorageService) {}

  async loadTheme() {
    const saved = await this.storage.get<Theme>('theme');
    const theme: Theme = saved ?? 'dark';
    this.applyTheme(theme);
  }

  async toggleTheme() {
    const next: Theme = this.theme$.getValue() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    await this.storage.set('theme', next);
  }

  private applyTheme(theme: Theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
    this.theme$.next(theme);
  }
}