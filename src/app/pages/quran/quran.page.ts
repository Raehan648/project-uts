import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuranService, Surah } from '../../services/quran';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-quran',
  templateUrl: './quran.page.html',
  styleUrls: ['./quran.page.scss'],
  standalone: false,
})
export class QuranPage implements OnInit {
  allSurahs: Surah[] = [];
  filteredSurahs: Surah[] = [];
  lastRead: { surahNumber: number; surahName: string; ayahNumber: number } | null = null;
  searchQuery = '';
  isLoading = true;
  activeFilter: 'all' | 'makkiyah' | 'madaniyah' = 'all';

  constructor(
    private quranSvc: QuranService,
    private storageSvc: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.lastRead = await this.storageSvc.get('lastRead');

    this.quranSvc.getAllSurahs().subscribe({
      next: (surahs) => {
        this.allSurahs = surahs;
        this.filteredSurahs = surahs;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  onSearch(event: any) {
    this.searchQuery = event.detail.value ?? '';
    this.applyFilter();
  }

  setFilter(f: 'all' | 'makkiyah' | 'madaniyah') {
    this.activeFilter = f;
    this.applyFilter();
  }

  applyFilter() {
    let list = [...this.allSurahs];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.englishName.toLowerCase().includes(q) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          String(s.number).includes(q)
      );
    }
    if (this.activeFilter !== 'all') {
      const type = this.activeFilter === 'makkiyah' ? 'Meccan' : 'Medinan';
      list = list.filter((s) => s.revelationType === type);
    }
    this.filteredSurahs = list;
  }

  getRevelationLabel(type: string): string {
    return type === 'Meccan' ? 'Makkiyah' : 'Madaniyah';
  }

  openSurah(number: number) {
    this.router.navigate(['/quran', number]);
  }

  continueReading() {
    if (this.lastRead) {
      this.router.navigate(['/quran', this.lastRead.surahNumber]);
    }
  }
}