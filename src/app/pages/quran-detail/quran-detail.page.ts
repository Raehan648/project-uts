import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { QuranService, SurahDetail, Ayah } from '../../services/quran';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-quran-detail',
  templateUrl: './quran-detail.page.html',
  styleUrls: ['./quran-detail.page.scss'],
  standalone: false,
})
export class QuranDetailPage implements OnInit, OnDestroy {
  detail: SurahDetail | null = null;
  isLoading = true;
  showTranslation = true;
  bookmarkedAyahs: number[] = [];
  playingAyah: number | null = null;
  private audio: HTMLAudioElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private quranSvc: QuranService,
    private storageSvc: StorageService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookmarkedAyahs = (await this.storageSvc.get<number[]>('bookmarks')) ?? [];

    this.quranSvc.getSurahWithTranslation(id).subscribe({
      next: (d) => { this.detail = d; this.isLoading = false; this.saveLastRead(d, 1); },
      error: () => { this.isLoading = false; },
    });
  }

  toggleTranslation() { this.showTranslation = !this.showTranslation; }

  async toggleBookmark(ayah: Ayah) {
    const idx = this.bookmarkedAyahs.indexOf(ayah.number);
    if (idx >= 0) this.bookmarkedAyahs.splice(idx, 1);
    else this.bookmarkedAyahs.push(ayah.number);
    await this.storageSvc.set('bookmarks', this.bookmarkedAyahs);
  }

  isBookmarked(ayah: Ayah): boolean { return this.bookmarkedAyahs.includes(ayah.number); }

  playAudio(ayah: Ayah) {
    if (this.audio) { this.audio.pause(); this.audio = null; this.playingAyah = null; }
    if (!ayah.audio) return;
    this.audio = new Audio(ayah.audio);
    this.playingAyah = ayah.number;
    this.audio.play();
    this.audio.onended = () => { this.playingAyah = null; };
  }

  stopAudio() {
    this.audio?.pause();
    this.audio = null;
    this.playingAyah = null;
  }

  isPlaying(ayah: Ayah): boolean { return this.playingAyah === ayah.number; }

  private async saveLastRead(d: SurahDetail, ayahNum: number) {
    await this.storageSvc.set('lastRead', {
      surahNumber: d.surah.number,
      surahName: d.surah.englishName,
      ayahNumber: ayahNum,
    });
  }

  goBack() { this.navCtrl.back(); }

  ngOnDestroy() { this.stopAudio(); }
}