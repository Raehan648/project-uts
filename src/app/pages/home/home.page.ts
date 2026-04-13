import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrayerService, PrayerItem } from '../../services/prayer';
import { LocationService } from '../../services/location';
import { StorageService } from '../../services/storage';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  userName = 'Sahabat';
  hijriDate = '';
  prayerList: PrayerItem[] = [];
  nextPrayer: PrayerItem | null = null;
  countdown = '--:--:--';
  isLoading = true;
  errorMsg = '';

  private subs: Subscription[] = [];

  constructor(
    private prayerSvc: PrayerService,
    private locationSvc: LocationService,
    private storageSvc: StorageService,
    private notifSvc: NotificationService,
    private router: Router
  ) {}

  async ngOnInit() {
    const savedName = await this.storageSvc.get<string>('userName');
    if (savedName) this.userName = savedName;

    await this.loadPrayerData();
    this.loadHijriDate();

    this.subs.push(
      this.prayerSvc.countdown$.subscribe((v) => (this.countdown = v)),
      this.prayerSvc.nextPrayer$.subscribe((v) => (this.nextPrayer = v))
    );
  }

  async loadPrayerData() {
    this.isLoading = true;
    this.errorMsg = '';
    try {
      const coords = await this.locationSvc.getCurrentPosition();
      this.prayerSvc.getTodayTimings(coords.latitude, coords.longitude).subscribe({
        next: (timings) => {
          this.prayerList = this.prayerSvc.buildPrayerList(timings);
          this.prayerSvc.startCountdown(this.prayerList);
          this.notifSvc.schedulePrayerReminders(this.prayerList);
          this.isLoading = false;
        },
        error: () => {
          this.errorMsg = 'Gagal memuat jadwal sholat. Periksa koneksi internet.';
          this.isLoading = false;
        },
      });
    } catch {
      this.errorMsg = 'Izin lokasi diperlukan untuk menampilkan jadwal sholat.';
      this.isLoading = false;
    }
  }

  loadHijriDate() {
    this.prayerSvc.getHijriDate().subscribe({
      next: (h) => {
        this.hijriDate = `${h.day} ${h.month.en} ${h.year} H`;
      },
    });
  }

  isPassed(time: string): boolean {
    const [hh, mm] = time.split(':').map(Number);
    const t = new Date();
    t.setHours(hh, mm, 0, 0);
    return t < new Date();
  }

  isNext(prayer: PrayerItem): boolean {
    return this.nextPrayer?.name === prayer.name;
  }

  getProgressWidth(): string {
    if (!this.nextPrayer || this.prayerList.length === 0) return '0%';
    const idx = this.prayerList.findIndex((p) => p.name === this.nextPrayer?.name);
    return `${((idx) / this.prayerList.length) * 100}%`;
  }

  greetingText(): string {
    const h = new Date().getHours();
    if (h < 5)  return 'Selamat dini hari';
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 18) return 'Selamat sore';
    return 'Selamat malam';
  }

  navigateTo(path: string) {
    this.router.navigate(['/tabs', path]);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}